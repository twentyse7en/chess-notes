function toPgnFromBlock(rawText: string): string {
  return rawText
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/^moves:\s*/i, '');
}

async function enhanceMovementBlocks(): Promise<void> {
  const mod = await import('@lichess-org/pgn-viewer');
  const LichessPgnViewer = mod.default;
  const selectors = ['pre > code.language-movement', 'pre > code.language-chess'];
  const blocks = document.querySelectorAll<HTMLElement>(selectors.join(','));

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
    void enhanceMovementBlocks();
  });
} else {
  void enhanceMovementBlocks();
}
