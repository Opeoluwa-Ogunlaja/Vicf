import ExcelJS from "exceljs";
import { PassThrough } from "stream";

/**
 * Converts a JSON array into an Excel file.
 * - Keys become columns.
 * - Nested objects are stringified into JSON (to avoid exploding columns).
 */
export async function jsonToExcel<T extends Record<string, any>>(
  data: T[],
  outputPath: string
): Promise<void> {
  if (!data || data.length === 0) {
    throw new Error("Data array is empty");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  // Collect top-level keys (columns)
  const columns = Object.keys(data[0]).map((key) => ({
    header: key,
    key: key,
    width: 20,
  }));

  worksheet.columns = columns;

  // Transform rows: stringify nested objects
  const rows = data.map((item) => {
    const row: Record<string, any> = {};
    for (const [key, value] of Object.entries(item)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        // stringify random-key objects
        row[key] = JSON.stringify(value);
      } else {
        row[key] = value;
      }
    }
    return row;
  });

  worksheet.addRows(rows);

  // Save Excel
  await workbook.xlsx.writeFile(outputPath);
}

/**
 * Converts a JSON array into an Excel (XLSX) stream.
 * - Keys become columns.
 * - Nested objects are stringified as JSON (to avoid exploding columns).
 */
export async function jsonToExcelStream<T extends Record<string, any>>(
  data: T[]
): Promise<NodeJS.ReadableStream> {
  if (!data || data.length === 0) {
    throw new Error("Data array is empty");
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  // Collect top-level keys (columns)
  const columns = Object.keys(data[0]).map((key) => ({
    header: key,
    key: key,
    width: 20,
  }));

  worksheet.columns = columns;

  // Transform rows: stringify nested objects
  const rows = data.map((item) => {
    const row: Record<string, any> = {};
    for (const [key, value] of Object.entries(item)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        row[key] = JSON.stringify(value);
      } else {
        row[key] = value;
      }
    }
    return row;
  });

  worksheet.addRows(rows);

  // Create a PassThrough stream
  const stream = new PassThrough();
  workbook.xlsx.write(stream).then(() => {
    stream.end();
  });

  return stream;
}
