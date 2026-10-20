const PHYSICAL_CODE_BINDINGS = Object.freeze({
  Space: "Space",
  Escape: "Escape",
  Enter: "Enter",
  NumpadEnter: "Enter",
  Backspace: "Backspace",
  Minus: "-",
  Equal: "=",
  BracketLeft: "[",
  BracketRight: "]",
  Backslash: "\\",
  Semicolon: ";",
  Quote: "'",
  Backquote: "`",
  Comma: ",",
  Period: ".",
  Slash: "/"
});

export function physicalBindingFromCode(code) {
  const raw = String(code || "");
  if (/^Key[A-Z]$/.test(raw)) return raw.slice(3).toLowerCase();
  if (/^Digit[0-9]$/.test(raw)) return raw.slice(5);
  return PHYSICAL_CODE_BINDINGS[raw] || "";
}

export function logicalBindingFromKey(key) {
  const raw = String(key || "");
  if (raw === " ") return "Space";
  if (["Escape", "Enter", "Backspace"].includes(raw)) return raw;
  if (raw.length === 1) return raw.toLowerCase();
  return raw;
}

export function bindingCandidatesFromEvent(event) {
  const physical = physicalBindingFromCode(event?.code);
  const logical = logicalBindingFromKey(event?.key);
  return [...new Set([physical, logical].filter(Boolean))];
}

export function canonicalBindingFromEvent(event) {
  return bindingCandidatesFromEvent(event)[0] || "";
}

export function bindingMatchesEvent(event, binding) {
  const expected = String(binding || "").toLowerCase();
  if (!expected) return false;
  return bindingCandidatesFromEvent(event)
    .some((candidate) => String(candidate).toLowerCase() === expected);
}
