export class NoteScriptError extends Error {
  constructor(message, line) {
    super(line ? `Line ${line}: ${message}` : message);
    this.name = "NoteScriptError";
    this.line = line;
  }
}
