// import { Schema, SchemaDefinition } from "mongoose";
// import { encrypt, decrypt, hmacHash, EncryptedData } from "./crypto";

// interface EncryptedFieldPluginOptions {
//   field: string;
//   hashField?: string;
//   encryptedField?: string;
// }

// declare module "mongoose" {
//   interface Document {
//     getDecrypted: () => Record<string, string | undefined>;
//   }
// }

// export function encryptedFieldPlugin(
//   schema: Schema,
//   options: EncryptedFieldPluginOptions
// ) {
//   const {
//     field,
//     hashField = `${field}Hash`,
//     encryptedField = `${field}Encrypted`,
//   } = options;

//   // Remove plain field if defined
//   if (schema.path(field)) {
//     schema.remove(field);
//   }

//   // Add encrypted + hash fields
//   const encryptedSchema: SchemaDefinition = {
//     [encryptedField]: {
//       encrypted: { type: String },
//       iv: { type: String },
//       tag: { type: String },
//     },
//     [hashField]: {
//       type: String,
//       index: true,
//       unique: false, // allow multiple users with nulls
//       sparse: true,
//     },
//   };
//   schema.add(encryptedSchema);

//   // Virtual accessor
//   schema
//     .virtual(field)
//     .get(function (this: any) {
//       const enc: EncryptedData | undefined = this[encryptedField];
//       if (!enc?.encrypted || !enc?.iv || !enc?.tag) return undefined;
//       return decrypt(enc);
//     })
//     .set(function (this: any, value: string) {
//       this[`__${field}`] = value;
//     });

//   // Encrypt + hash before save
//   schema.pre("save", function (this: any, next) {
//     const raw = this[`__${field}`];
//     if (raw) {
//       this[encryptedField] = encrypt(raw);
//       this[hashField] = hmacHash(raw);
//     }
//     next();
//   });

//   // 🔍 Query middleware: rewrite { field: value } to { hashField: hmac(value) }
//   const rewriteQuery = function (this: any, next: () => void) {
//     const q = this.getQuery();
//     if (q[field]) {
//       q[hashField] = hmacHash(q[field]);
//       delete q[field];
//       this.setQuery(q);
//     }
//     next();
//   };

//   schema.pre("findOne", rewriteQuery);
//   schema.pre("find", rewriteQuery);
//   schema.pre("deleteOne", rewriteQuery);
//   schema.pre("deleteMany", rewriteQuery);

//   // Method to return decrypted values
//   schema.methods.getDecrypted = function () {
//     return { [field]: this[field] };
//   };
// }

import { Schema, SchemaDefinition } from 'mongoose'
import { encrypt, decrypt, hmacHash, EncryptedData } from './crypto'

interface EncryptedFieldConfig {
  field: string
  hashField?: string
  encryptedField?: string
}

interface EncryptedFieldPluginOptions {
  fields: EncryptedFieldConfig[];
}


declare module 'mongoose' {
  interface Document {
    getDecrypted: () => Record<string, string | undefined>
  }
}

/**
 * Walk query/update objects and rewrite { field: value } into { hashField: hmac(value) }.
 */
function rewriteObject(obj: any, field: string, hashField: string) {
  if (!obj || typeof obj !== 'object') return

  for (const key of Object.keys(obj)) {
    const value = obj[key]

    // Handle logical operators like $or, $and
    if (['$or', '$and', '$nor'].includes(key) && Array.isArray(value)) {
      value.forEach((sub: any) => rewriteObject(sub, field, hashField))
      continue
    }

    // Handle field direct match
    if (key === field) {
      if (typeof value === 'string') {
        obj[hashField] = hmacHash(value)
        delete obj[field]
      } else if (value && typeof value === 'object') {
        // Handle operators like $in, $eq
        for (const op of Object.keys(value)) {
          if (['$eq'].includes(op) && typeof value[op] === 'string') {
            value[op] = hmacHash(value[op])
          }
          if (['$in', '$nin'].includes(op) && Array.isArray(value[op])) {
            value[op] = value[op].map((v: string) => hmacHash(v))
          }
        }
        obj[hashField] = value
        delete obj[field]
      }
    } else if (typeof value === 'object') {
      rewriteObject(value, field, hashField)
    }
  }
}

function rewriteAggregationObject(obj: any, field: string, hashField: string) {
  if (!obj || typeof obj !== "object") return;

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (["$or", "$and", "$nor"].includes(key) && Array.isArray(value)) {
      value.forEach((sub: any) => rewriteAggregationObject(sub, field, hashField));
      continue;
    }

    if (key === field) {
      if (typeof value === "string") {
        obj[hashField] = hmacHash(value);
        delete obj[field];
      } else if (value && typeof value === "object") {
        for (const op of Object.keys(value)) {
          if (["$eq"].includes(op) && typeof value[op] === "string") {
            value[op] = hmacHash(value[op]);
          }
          if (["$in", "$nin"].includes(op) && Array.isArray(value[op])) {
            value[op] = value[op].map((v: string) => hmacHash(v));
          }
        }
        obj[hashField] = value;
        delete obj[field];
      }
    } else if (typeof value === "object") {
      rewriteAggregationObject(value, field, hashField);
    }
  }
}

function rewriteAggregationPipeline(
  pipeline: any[],
  fields: { field: string; hashField: string }[]
) {
  return pipeline.map(stage => {
    if (stage.$match || stage.$project || stage.$set) {
      fields.forEach(({ field, hashField }) =>
        rewriteAggregationObject(stage, field, hashField)
      );
    }
    return stage;
  });
}

export function encryptedFieldPlugin(schema: Schema, options: EncryptedFieldPluginOptions) {
  const { fields } = options;

  // Track all encrypted fields
  if (!(schema as any).encryptedFields) {
    (schema as any).encryptedFields = [];
  }

  for (const f of fields) {
    const { field, hashField = `${field}Hash`, encryptedField = `${field}Encrypted` } = f;

    // Remove plain field if it exists in schema
    if (schema.path(field)) {
      schema.remove(field);
    }

    // Add encrypted + hash fields
    const encryptedSchema: SchemaDefinition = {
      [encryptedField]: {
        encrypted: { type: String },
        iv: { type: String },
        tag: { type: String }
      },
      [hashField]: {
        type: String,
        index: true,
        sparse: true
      }
    };
    schema.add(encryptedSchema);

    // Virtual field accessor
    schema
      .virtual(field)
      .get(function (this: any) {
        const enc: EncryptedData | undefined = this[encryptedField];
        if (!enc?.encrypted || !enc?.iv || !enc?.tag) return undefined;
        return decrypt(enc);
      })
      .set(function (this: any, value: string) {
        this[`__${field}`] = value;
      });

    // Encrypt + hash before save
    schema.pre("save", function (this: any, next) {
      const raw = this[`__${field}`];
      if (raw !== undefined) {
        this[encryptedField] = encrypt(raw);
        this[hashField] = hmacHash(raw);
      }
      next();
    });

    // Register for aggregation post-processing
    (schema as any).encryptedFields.push({ field, hashField, encryptedField });
  }

  /**
   * 🔍 Query & Update middleware (applies to all fields)
   */
  const queryMiddleware = function (this: any, next: () => void) {
    const q = this.getQuery();
    const update = this.getUpdate();

    for (const { field, hashField = `${field}Hash`, encryptedField = `${field}Encrypted` } of fields) {
      rewriteObject(q, field, hashField);

      if (update) {
        if (update.$set && update.$set[field]) {
          const raw = update.$set[field];
          update.$set[encryptedField] = encrypt(raw);
          update.$set[hashField] = hmacHash(raw);
          delete update.$set[field];
        }

        if (update.$unset && update.$unset[field]) {
          update.$unset[hashField] = update.$unset[field];
          update.$unset[encryptedField] = update.$unset[field];
          delete update.$unset[field];
        }
      }
    }

    next();
  };

  schema.pre("find", queryMiddleware);
  schema.pre("findOne", queryMiddleware);
  schema.pre("findOneAndUpdate", queryMiddleware);
  schema.pre("updateOne", queryMiddleware);
  schema.pre("updateMany", queryMiddleware);
  schema.pre("deleteOne", queryMiddleware);
  schema.pre("deleteMany", queryMiddleware);

  /**
   * 🔐 Helper to get decrypted fields from a document
   */
  schema.methods.getDecrypted = function () {
    const result: Record<string, any> = {};
    for (const { field } of fields) {
      result[field] = this[field];
    }
    return result;
  };

  /**
   * 📊 Secure aggregate (rewrites $match/$project & decrypts)
   */
  schema.statics.secureAggregate = async function (pipeline: any[]) {
    const encryptedFields = (this as any).encryptedFields || [];
    const rewritten = rewriteAggregationPipeline(pipeline, encryptedFields);

    const docs = await this.aggregate(rewritten);

    return docs.map((doc: any) => {
      const plainDoc = { ...doc };
      for (const { field, encryptedField } of encryptedFields) {
        if (doc[encryptedField]) {
          try {
            plainDoc[field] = decrypt(doc[encryptedField]);
          } catch {
            plainDoc[field] = null;
          }
        }
      }
      return plainDoc;
    });
  };
}