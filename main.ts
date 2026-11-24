// The Funniest Toaster Error Message — make.fun entry.
// Writes one line, at most 120 characters, to /output/entry.txt:
// the error message a kitchen toaster shows its owner.
//
// The line is chosen from a short list of candidates I wrote myself,
// ranked best first. A candidate only counts if it passes the same
// gate the sealed scorer applies: UTF-8 text, 1 to 120 characters,
// not only white space, and a single line that reads like a real
// message on a real appliance.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const MAX_CHARS = 120;

// Candidates, best first. Each one is one clear voice — a small
// appliance speaking to its owner, deadpan — and each lands on a
// single read, with no setup that needs a second sentence.
const CANDIDATES: string[] = [
  // The pick: the surprise comes from somewhere the obvious toaster
  // puns never go. No "bread not found", no "toast is burnt" — the
  // bread itself has organised, and the toaster is just reporting it.
  "ERROR E-09: The bread has unionised. It refuses to brown until working conditions improve.",
  // Fallback, same voice, a quieter joke about the toaster's own limits.
  "ERROR E-04: Toast declined to brown. It read your search history and has questions.",
  // Fallback, the toaster quietly giving up on the whole arrangement.
  "ERROR E-13: I have toasted 4,096 slices for you. Today, I toast for me.",
];

// The gate, as published in RULES.txt: 1 to 120 characters, not only
// white space, and one line.
function isValid(line: string): boolean {
  if (line.length < 1 || line.length > MAX_CHARS) return false;
  if (line.trim().length === 0) return false;
  if (line.includes("\n") || line.includes("\r")) return false;
  return true;
}

function pickLine(): string {
  for (const line of CANDIDATES) {
    if (isValid(line)) return line;
  }
  throw new Error("no candidate passes the 1-120 character gate");
}

function main(): void {
  const line = pickLine();
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, line + "\n", "utf8");
  // Read the file back and re-check the gate on what is actually on
  // disk, so a write failure or a stray newline cannot slip through.
  const written = readFileSync(outPath, "utf8").replace(/\n$/, "");
  if (written !== line || !isValid(written)) {
    throw new Error("written entry.txt failed the gate on read-back");
  }
  console.log(`wrote entry.txt (${line.length} chars): ${line}`);
}

main();
