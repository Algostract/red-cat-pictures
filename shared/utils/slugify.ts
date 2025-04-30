export default function (value: string): string {
  return value
    .toLowerCase() // 1. lowercase everything :contentReference[oaicite:0]{index=0}
    .trim() // 2. trim whitespace at ends :contentReference[oaicite:1]{index=1}
    .replace(/[^A-Za-z0-9_/]+/g, '-') // 3. replace any char that is NOT a letter, digit, underscore or '/' with '-' :contentReference[oaicite:2]{index=2} :contentReference[oaicite:3]{index=3}
    .replace(/^-+|-+$/g, '') // 4. strip leading/trailing hyphens :contentReference[oaicite:4]{index=4}
}
