import { promises as fs } from "fs";
import path from "path";

export async function saveLocalFile(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), bytes);
  return { url: `/uploads/${filename}`, filename, size: bytes.length, mimeType: file.type || "application/octet-stream" };
}
