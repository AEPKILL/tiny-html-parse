export function isBreakLine(ch: string) {
  return ch === '\n';
}
export function isEscaped(ch: string) {
  return ch === '\\';
}
export function isWhitespace(ch: string) {
  return /\s/.test(ch);
}
export function isQuote(ch: string) {
  return `'` === ch || `"` === ch;
}
