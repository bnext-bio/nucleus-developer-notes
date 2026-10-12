/**
 * Builds `../devnotes-network.mjs`, the one file the landing page loads.
 *
 * It fetches the DevNotes first and bakes them into the bundle, so the graph draws as
 * soon as the page opens; the widget then loads the live notes and swaps them in. If the
 * notes can't be fetched (offline, or the API is down), the bundle is built without them
 * and the page loads them in the browser, as it always does.
 *
 *   bun run build              # with the notes as they are now
 *   bun run build --no-snapshot
 *
 * `DEVNOTES_SITE` and `DEVNOTES_API` change which site's notes are baked in.
 */
import { snapshotDevnotesGraph, type DevnotesGraphSnapshot } from './src/widget';

const out = new URL('../devnotes-network.mjs', import.meta.url).pathname;

let snapshot: DevnotesGraphSnapshot | null = null;
if (!process.argv.includes('--no-snapshot')) {
  try {
    const { DEVNOTES_SITE: site, DEVNOTES_API: api } = process.env;
    snapshot = await snapshotDevnotesGraph(
      { ...(site && { site }), ...(api && { api }) },
      AbortSignal.timeout(120_000),
    );
    const { notes, people } = snapshot.graph;
    console.log(
      `Snapshot of ${snapshot.site}: ${Object.keys(notes).length} notes, ${Object.keys(people).length} people and groups`,
    );
  } catch (error) {
    console.warn(`No snapshot, the page will load the notes itself: ${error}`);
  }
}

const result = await Bun.build({
  entrypoints: [new URL('./src/widget.ts', import.meta.url).pathname],
  format: 'esm',
  target: 'browser',
  minify: true,
  define: { __DEVNOTES_SNAPSHOT__: JSON.stringify(snapshot) },
  banner:
    '/* Who writes DevNotes (anywidget). Built from widgets/devnotes-network by `bun run build`: do not edit. */',
});
if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}
await Bun.write(out, result.outputs[0]);
console.log(`Wrote ${out} (${(result.outputs[0].size / 1024).toFixed(0)} KB)`);
