# Chess Notes

Markdown-first chess notes with replayable movement blocks and automatic GitHub Pages deploy.

## Folder structure

```
notes/
  topic/
    subtopic/
      note.md
```

## Chess movement blocks in markdown

Use fenced code blocks with `movement`:

````md
```movement
1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7#
```
````

These blocks are automatically replaced by a Lichess PGN viewer board on note pages.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## GitHub Pages deployment

- Push to `main` branch.
- GitHub Actions workflow at `.github/workflows/deploy.yml` builds and deploys automatically.
- In repository settings, set **Pages > Build and deployment > Source = GitHub Actions**.

## License note

This project uses `@lichess-org/pgn-viewer` (GPL-3.0-or-later).
