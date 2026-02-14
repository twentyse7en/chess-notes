import LichessPgnViewer from '@lichess-org/pgn-viewer';

function toPgnFromBlock(rawText) {
  const normalized = rawText.trim().replace(/\s+/g, ' ').replace(/^moves:\s*/i, '');

  if (!normalized) return '';
  if (/^\d+\./.test(normalized)) return normalized;

  const tokens = normalized.split(' ');
  const chunks = [];
  for (let i = 0; i < tokens.length; i += 2) {
    const ply = Math.floor(i / 2) + 1;
    const white = tokens[i];
    const black = tokens[i + 1];
    chunks.push(`${ply}. ${white}${black ? ` ${black}` : ''}`);
  }
  return chunks.join(' ');
}

function enhanceMovementBlocks() {
  const selectors = ['pre > code.language-movement', 'pre > code.language-chess'];
  const blocks = document.querySelectorAll(selectors.join(','));

  blocks.forEach((codeEl) => {
    const pre = codeEl.closest('pre');
    const raw = codeEl.textContent ?? '';
    const pgn = toPgnFromBlock(raw);

    if (!pre || !pgn) return;

    const host = document.createElement('div');
    host.className = 'chess-note-viewer';
    pre.insertAdjacentElement('beforebegin', host);

    try {
      LichessPgnViewer(host, { pgn });
      pre.remove();
    } catch (error) {
      host.remove();
      console.error('Invalid movement block:', error);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    enhanceMovementBlocks();
  });
} else {
  enhanceMovementBlocks();
}
