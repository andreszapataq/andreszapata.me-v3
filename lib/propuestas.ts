import fs from "fs";
import path from "path";
import { Propuesta } from "@/types/propuesta";

const dataDir = path.join(process.cwd(), "data", "propuestas");

export function getPropuesta(slug: string): Propuesta | null {
  try {
    const filePath = path.join(dataDir, `${slug}.json`);
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as Propuesta;
  } catch {
    return null;
  }
}

export function getAllPropuestaSlugs(): string[] {
  try {
    const files = fs.readdirSync(dataDir);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}
