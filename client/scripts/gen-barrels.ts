import fs from "fs";
import path from "path";

const ignore = ["node_modules", ".next", ".git", "public"];

/***
 *
 * npx tsx scripts/gen-barrels.ts
 *
 */
function generateBarrel(dir: string) {
  const files = fs.readdirSync(dir);
  const exports = files
    .filter((f) => !ignore.includes(f) && !f.startsWith("index"))
    .map((f) => {
      const name = path.parse(f).name;
      return `export * from "./${name}";`;
    });

  if (exports.length) {
    fs.writeFileSync(path.join(dir, "index.ts"), exports.join("\n"));
  }
}

function walk(dir: string) {
  generateBarrel(dir);
  fs.readdirSync(dir).forEach((f) => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory() && !ignore.includes(f)) walk(p);
  });
}

walk(path.resolve("./src"));
