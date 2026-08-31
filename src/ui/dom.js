// Tiny DOM helpers. No framework — this app does not need one, and not having one
// means no build step, no dependencies and nothing to keep up to date.

export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k === 'dataset') Object.assign(node.dataset, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat(Infinity)) {
    if (c === null || c === undefined || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

export const clear = n => { while (n.firstChild) n.removeChild(n.firstChild); return n; };

/** Minimal inline markup for lesson prose: **bold** and *italic*. Text is escaped first. */
export function richText(src) {
  const esc = String(src)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
}

export function icon(name) {
  const paths = {
    home: 'M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z',
    learn: 'M4 5h7a2 2 0 0 1 2 2v13a3 3 0 0 0-3-2H4zM20 5h-7a2 2 0 0 0-2 2v13a3 3 0 0 1 3-2h6z',
    review: 'M20 11a8 8 0 1 0-2.3 5.6M20 5v6h-6',
    practice: 'M12 3v18M3 12h18',
    progress: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
    reference: 'M4 4h16v16H4zM8 8h8M8 12h8M8 16h5',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.9 19.4a1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H2a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 3.6 7.9a1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H8a1.6 1.6 0 0 0 1-1.5V2a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V8a1.6 1.6 0 0 0 1.5 1H22a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z',
    sound: 'M11 5 6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13',
    check: 'm5 13 4 4L19 7',
    close: 'M6 6l12 12M18 6 6 18',
  };
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.7');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', paths[name] || '');
  svg.append(p);
  return svg;
}

// ── speech ───────────────────────────────────────────────────────────────────
let jaVoice = null;
let voicesChecked = false;

export function refreshVoices() {
  if (!('speechSynthesis' in window)) return null;
  const voices = speechSynthesis.getVoices();
  if (voices.length) {
    voicesChecked = true;
    jaVoice = voices.find(v => v.lang === 'ja-JP') || voices.find(v => v.lang?.startsWith('ja')) || null;
  }
  return jaVoice;
}

export function audioAvailable() {
  if (!('speechSynthesis' in window)) return false;
  if (!voicesChecked) refreshVoices();
  return !!jaVoice;
}

/** Speak Japanese text. Returns false if no Japanese voice exists on this device. */
export function speak(text, { rate = 0.9 } = {}) {
  if (!audioAvailable()) return false;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = jaVoice;
    u.lang = 'ja-JP';
    u.rate = rate;
    speechSynthesis.speak(u);
    return true;
  } catch { return false; }
}
