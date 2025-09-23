interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface Contact {
  name: string
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  phone?: string;
  email?: string;
  url?: string;
  address?: Address;
  birthday?: string;
  [key: string]: any; // For custom fields
}

type FlatObject = Record<string, string | number | boolean>;

const STANDARD_KEYS = new Set<string>([
  'firstName', 'lastName', 'organization', 'title', 'phone', 'email',
  'url', 'address', 'birthday'
] as const);

/**
 * Flattens a nested object into a flat structure with dot notation keys
 */
function flattenObject(obj: Record<string, any>, prefix = ''): FlatObject {
  const result: FlatObject = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const flatKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value, flatKey));
    } else if (value != null) { // Skip null and undefined
      result[flatKey] = value;
    }
  }
  
  return result;
}

/**
 * Escapes special characters in VCF values
 */
function escapeVcfValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')  // Escape backslashes
    .replace(/,/g, '\\,')    // Escape commas
    .replace(/;/g, '\\;')    // Escape semicolons
    .replace(/\n/g, '\\n');  // Escape newlines
}

/**
 * Converts a single contact object to VCF format
 */
function jsonToVcf(contact: Contact): string {
  ;[contact.firstName, contact.lastName] = contact.name.split('_')
  if (!contact.firstName || !contact.lastName) {
    throw new Error('Contact must have at least firstName and lastName.');
  }

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVcfValue(contact.lastName)};${escapeVcfValue(contact.firstName)};;;`,
    `FN:${escapeVcfValue(`${contact.name}`)}`
  ];

  // Add standard fields
  if (contact.organization) {
    lines.push(`ORG:${escapeVcfValue(contact.organization)}`);
  }
  if (contact.title) {
    lines.push(`TITLE:${escapeVcfValue(contact.title)}`);
  }
  if (contact.phone) {
    lines.push(`TEL;TYPE=CELL:${escapeVcfValue(contact.phone)}`);
  }
  if (contact.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVcfValue(contact.email)}`);
  }
  if (contact.url) {
    lines.push(`URL:${escapeVcfValue(contact.url)}`);
  }
  if (contact.birthday) {
    lines.push(`BDAY:${escapeVcfValue(contact.birthday)}`);
  }

  // Handle address
  if (contact.address && typeof contact.address === 'object') {
    const {
      street = '',
      city = '',
      state = '',
      zip = '',
      country = ''
    } = contact.address;
    
    const addressParts = [
      '', // PO Box (empty)
      '', // Extended address (empty)
      escapeVcfValue(street),
      escapeVcfValue(city),
      escapeVcfValue(state),
      escapeVcfValue(zip),
      escapeVcfValue(country)
    ];
    
    lines.push(`ADR;TYPE=HOME:${addressParts.join(';')}`);
  }

  // Add custom fields
  const flatContact = flattenObject(contact);
  for (const [key, value] of Object.entries(flatContact)) {
    const rootKey = key.split('.')[0];
    if (!STANDARD_KEYS.has(rootKey)) {
      lines.push(`X-${key.toUpperCase().replace(/\./g, '-')}:${escapeVcfValue(String(value))}`);
    }
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}

/**
 * Converts JSON contact data to VCF format
 */
export function convertJsonToVcf(input: Contact | Contact[]): string {
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return '';
    }
    return input.map(jsonToVcf).join('\n\n');
  }
  
  return jsonToVcf(input);
}

// Export types for consumers
export type { Contact, Address };