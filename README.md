# Trajectoire — stuckinwaveforms interview

Static single-page interview, ready for GitHub Pages. No build step or package installation.

## Preview locally

From this folder:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000/`. Use `?lang=fr` or `?lang=en` for a language-specific link. The top switch remembers the reader's selection when browser storage is available.

Use an HTTP server when checking players: YouTube requires a valid referring origin, which a local `file:` preview does not provide.

## Edit

- `index.html`: page structure and default French content, also readable without JavaScript.
- `interview-data.js`: the nine French questions and answers, their English translations, with paragraph-level recording placements. French was extracted from the supplied ODT and includes the requested editorial corrections.
- `app.js`: supplied intro captions, translated interface labels, language selection and embedded players.
- `tracks.js`: recording links and extracted artwork references. Nine YouTube recordings and one official Bandcamp fallback for Monte Booker's `western cape`.
- `styles.css`: the approved Liner notes layout with locally hosted Geist.
- `assets/`: supplied cover and logos, artwork extracted from the supplied ZIP, and Geist with its SIL Open Font License.

When changing French content, update both the data and the default HTML so the no-JavaScript version stays consistent.

## GitHub Pages

For `https://trajectoirelabel.github.io/`, the repository should be named `trajectoirelabel.github.io`. For a project URL, use another repository name; the relative asset paths support both.

Place the contents of this folder at the repository root. In repository Settings → Pages, select deployment from the main branch and the root folder. The included `.nojekyll` enables direct static serving.

Player controls and iframe URLs are checked locally; live playback still depends on the upload's embedding permissions and regional availability.
