import fs from "fs";
import path from "path";

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

function sortByNumericSuffix(a: string, b: string) {
  const pattern = /_(\d+)/;
  const matchA = a.match(pattern);
  const matchB = b.match(pattern);
  if (matchA && matchB) {
    const numberA = Number.parseInt(matchA[1], 10);
    const numberB = Number.parseInt(matchB[1], 10);
    if (!Number.isNaN(numberA) && !Number.isNaN(numberB)) {
      return numberA - numberB;
    }
  }
  return a.localeCompare(b);
}

export function getBeeImagePaths(desiredTotal = 30): string[] {
  const directory = path.join(process.cwd(), "public", "bee-nfts");

  let files: string[] = [];
  try {
    files = fs.readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .sort(sortByNumericSuffix);
  } catch (error) {
    console.warn("Bee image directory missing or unreadable:", error);
    return [];
  }

  if (files.length === 0) {
    return [];
  }

  const required = Math.max(desiredTotal, 1);
  if (files.length >= required) {
    return files.slice(0, required).map((file) => `/bee-nfts/${file}`);
  }

  const expanded: string[] = [];
  for (let index = 0; index < required; index += 1) {
    const file = files[index % files.length];
    expanded.push(`/bee-nfts/${file}`);
  }

  return expanded;
}
