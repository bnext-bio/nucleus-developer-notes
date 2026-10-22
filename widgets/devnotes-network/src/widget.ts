/**
 * Who writes DevNotes: everyone who has written a DevNote, and who they wrote it with.
 * The notes are fetched in the browser (the SCMS works list, then each note's config and
 * page from the CDN), and `bun run build` bundles this into `../devnotes-network.mjs`,
 * which runs anywhere:
 *
 * - as an anywidget in a MyST / Curvenote site (the landing page, `index.md`):
 *
 *   :::{anywidget} widgets/devnotes-network.mjs
 *   { "site": "bnext-devnotes", "height": 640 }
 *   :::
 *
 * - or on any page: `import { mount } from './devnotes-network.mjs'; mount(el, { site })`.
 *
 * It's a co-authorship network: a circle per person, with their initials, sized by how
 * many notes they've written and coloured by institution; a line between people who wrote
 * a note together (or whose notes link to each other). Pick someone — or find yourself —
 * and the panel lists their notes. New contributors get a green ring, and when the graph
 * refreshes (every `refresh` seconds) anyone who has just published pops in.
 *
 * The build also fetches the notes and bakes them in (see `build.ts`), so the graph draws
 * as soon as the page loads and the live one replaces it.
 */
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from 'd3-force';
import {
  buildDevnotesGraph,
  docTitle,
  isNewArrival,
  mdastSummary,
  mdastUrls,
  nodeId,
  noteForUrl,
  slugify,
  type CdnProject,
  type Doc,
  type DevnotesGraph,
  type Edge,
  type RawNote,
  type ScmsCollection,
  type ScmsWork,
} from './graph';
import { formatDate, initials } from './format';

export interface DevnotesGraphOptions {
  /** The SCMS site (default `bnext-devnotes`). */
  site?: string;
  /** The SCMS API (default `https://scms.curvenote.com/v1/`). */
  api?: string;
  /**
   * Height in pixels (default 640), or any CSS height (`'100%'`) to fill its container,
   * edge to edge, without a border of its own.
   */
  height?: number | string;
  /** Seconds between refreshes, so new notes pop in; 0 for never (default 60). */
  refresh?: number;
  /** A person is new for this many days after their first note (default 90). */
  newDays?: number;
  /** Hosts that serve this site's notes, for note → note links. */
  noteHosts?: string[];
  /** Hosts whose pages are docs (counted, not drawn). */
  docHosts?: string[];
  /** A person to find on load, by name. */
  highlight?: string;
  /** `auto` (default) follows the page's dark mode (`dark` on <html>). */
  theme?: 'auto' | 'light' | 'dark';
  /** The graph to draw while the live one loads (default: the one baked in by the build). */
  snapshot?: DevnotesGraphSnapshot | null;
}

/** The graph as it was at some time, for one site. */
export interface DevnotesGraphSnapshot {
  site: string;
  savedAt: string;
  graph: DevnotesGraph;
}

/** Set by `build.ts`: the notes as they were when the site was built. */
declare const __DEVNOTES_SNAPSHOT__: DevnotesGraphSnapshot | null | undefined;
let BUILT_SNAPSHOT: DevnotesGraphSnapshot | null = null;
try {
  BUILT_SNAPSHOT = __DEVNOTES_SNAPSHOT__ ?? null;
} catch {
  // Not built (tests, or the source loaded directly): no snapshot.
}

const DEFAULTS = {
  site: 'bnext-devnotes',
  api: 'https://scms.curvenote.com/v1/',
  height: 640 as number | string,
  theme: 'auto' as 'auto' | 'light' | 'dark',
  refresh: 60,
  newDays: 90,
  noteHosts: ['devnotes.nucleus.engineering', 'devnotes.bnext.bio'],
  docHosts: ['docs.nucleus.engineering'],
};

type Resolved = typeof DEFAULTS & { highlight?: string; snapshot?: DevnotesGraphSnapshot | null };

// ─── Data ───────────────────────────────────────────────────────────────────────────────

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const resp = await fetch(url, { headers: { Accept: 'application/json' }, signal });
  if (!resp.ok) throw new Error(`${resp.status} from ${url}`);
  return (await resp.json()) as T;
}

/** `fn` over `items`, `limit` at a time. */
async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

/** Notes already read, by work and CDN key: a refresh only reads what's new or changed. */
const noteCache = new Map<string, RawNote>();

async function readNote(work: ScmsWork, signal?: AbortSignal): Promise<RawNote> {
  if (!work.cdn || !work.cdn_key) return { work, project: null, links: [] };
  const key = `${work.id}:${work.cdn_key}`;
  const hit = noteCache.get(key);
  if (hit) return { ...hit, work };
  try {
    const config = await getJson<{ projects?: (CdnProject & { index?: string })[] }>(
      work.links?.config ?? `${work.cdn}${work.cdn_key}/config.json`,
      signal,
    );
    const project = config.projects?.[0] ?? null;
    let raw: RawNote = { work, project, links: [] };
    if (project?.index) {
      const page = await getJson<{ mdast?: unknown }>(
        `${work.cdn}${work.cdn_key}/content/${project.index}.json`,
        signal,
      );
      raw = { work, project, links: mdastUrls(page.mdast), summary: mdastSummary(page.mdast) };
    }
    noteCache.set(key, raw);
    return raw;
  } catch (error) {
    if (signal?.aborted) throw error;
    // One note that won't load is a note without its details, not a broken graph.
    return { work, project: null, links: [] };
  }
}

/** The site's notes, people and links, read from the SCMS and the CDN. */
export async function loadDevnotesGraph(
  options: DevnotesGraphOptions = {},
  signal?: AbortSignal,
): Promise<DevnotesGraph> {
  const o = { ...DEFAULTS, ...options };
  const api = o.api.endsWith('/') ? o.api : `${o.api}/`;
  const base = `${api}sites/${o.site}`;
  const [site, works, collections] = await Promise.all([
    getJson<{ name: string; title: string; tagline?: string; url: string }>(base, signal),
    getJson<{ items: ScmsWork[] }>(`${base}/works?limit=500`, signal),
    getJson<{ items: ScmsCollection[] }>(`${base}/collections`, signal),
  ]);
  const raw = await pool(works.items, 8, (w) => readNote(w, signal));
  const siteHost = new URL(site.url).hostname;
  return buildDevnotesGraph(
    { name: site.name, title: site.title, tagline: site.tagline, url: site.url },
    raw,
    collections.items,
    {
      noteHosts: [...new Set([siteHost, ...o.noteHosts])],
      docHosts: o.docHosts,
      slugPrefixes: [`${o.site}-`],
    },
  );
}

/** The graph now, with when and for which site. */
export async function snapshotDevnotesGraph(
  options: DevnotesGraphOptions = {},
  signal?: AbortSignal,
): Promise<DevnotesGraphSnapshot> {
  const graph = await loadDevnotesGraph(options, signal);
  return { site: options.site ?? DEFAULTS.site, savedAt: new Date().toISOString(), graph };
}

/**
 * Crawls a docs site's public `myst.xref.json` manifest and every page it lists for links
 * back to this graph's notes — the direction a note's own links can't see, since docs
 * pages cite a DevNote far more often than a DevNote links out to docs. A page that fails
 * to fetch or parse is skipped, not fatal.
 *
 * Call this once at build time (see `build.ts`), never from the live 60-second refresh:
 * it fetches every page of the docs site, which `loadDevnotesGraph` has no reason to do
 * on a timer.
 */
export async function fetchDocCitations(
  graph: Pick<DevnotesGraph, 'notes' | 'aliases' | 'linking'>,
  docsBaseUrl: string,
  signal?: AbortSignal,
): Promise<{ docs: Record<string, Doc>; edges: Edge[] }> {
  const base = docsBaseUrl.replace(/\/+$/, '');
  const docs: Record<string, Doc> = {};
  const edges: Edge[] = [];
  let pages: { kind: string; data: string; url: string }[];
  try {
    const xref = await getJson<{ references?: typeof pages }>(`${base}/myst.xref.json`, signal);
    pages = (xref.references ?? []).filter((r) => r.kind === 'page');
  } catch {
    return { docs, edges }; // docs site unreachable: no citations, not a broken build
  }
  await pool(pages, 8, async (p) => {
    let content: { frontmatter?: { title?: string }; mdast?: unknown };
    try {
      content = await getJson(`${base}${p.data}`, signal);
    } catch {
      return; // one page failing to fetch shouldn't drop the rest
    }
    const path = p.url.replace(/\/?$/, '/');
    let docId: string | undefined;
    for (const href of mdastUrls(content.mdast)) {
      const noteId = noteForUrl(href, graph.aliases, graph.linking);
      if (!noteId || !graph.notes[noteId]) continue;
      docId ??= nodeId('doc', slugify(path) || 'home');
      docs[docId] ??= {
        id: docId,
        url: `${base}${path}`,
        title: content.frontmatter?.title || docTitle(new URL(`${base}${path}`)),
        notes: [],
      };
      if (!docs[docId].notes.includes(noteId)) docs[docId].notes.push(noteId);
      edges.push({ source: docId, target: noteId, kind: 'doc', date: graph.notes[noteId].date });
    }
  });
  return { docs, edges };
}

// ─── The view: a co-authorship network ──────────────────────────────────────────────────

export interface ViewNode extends SimulationNodeDatum {
  id: string;
  label: string;
  initials: string;
  r: number;
  /** Notes they've written, or a docs page has cited. */
  count: number;
  /** Their main institution, for colour. Docs nodes have none. */
  institution?: string;
  /** Their first note is recent. Always false for a docs page. */
  isNew: boolean;
  date: string;
  /** A person who wrote notes, or a docs page that cites some of them. */
  kind: 'person' | 'doc';
  /** A docs page's own URL, to open from its panel. */
  url?: string;
  x?: number;
  y?: number;
}

export interface ViewEdge extends SimulationLinkDatum<ViewNode> {
  source: string | ViewNode;
  target: string | ViewNode;
  /** Wrote a note together, one's note links to the other's, or a docs page cites theirs. */
  kind: 'coauthor' | 'builds' | 'cites';
  /** How many notes. */
  weight: number;
}

export interface GraphView {
  nodes: ViewNode[];
  edges: ViewEdge[];
  /** Institutions by how many people they have, most first. */
  institutions: { id: string; name: string; people: number }[];
}

/**
 * People (not workshops or groups), joined where they wrote a note together; where they
 * didn't, but one's note links to the other's, a lighter "builds on" edge.
 */
export function graphView(graph: DevnotesGraph, today: string, newDays: number): GraphView {
  const people = Object.values(graph.people).filter((p) => !p.group);
  const ids = new Set(people.map((p) => p.id));
  const count = new Map<string, number>();
  for (const p of people) for (const i of p.institutions) count.set(i, (count.get(i) ?? 0) + 1);
  const institutions = [...count]
    .map(([id, n]) => ({ id, name: graph.institutions[id]?.name ?? id, people: n }))
    .sort((a, b) => b.people - a.people || a.name.localeCompare(b.name));
  const rank = new Map(institutions.map((i, k) => [i.id, k]));

  const nodes: ViewNode[] = people.map((p) => ({
    id: p.id,
    label: p.name,
    initials: initials(p.name),
    r: 6 + Math.sqrt(p.notes.length) * 4.5,
    count: p.notes.length,
    // Their biggest institution, so a lab and its university read as one colour.
    institution: [...p.institutions].sort((a, b) => rank.get(a)! - rank.get(b)!)[0],
    isNew: isNewArrival(p, today, newDays),
    date: p.firstDate,
    kind: 'person',
  }));

  const pairs = new Map<string, ViewEdge>();
  const add = (a: string, b: string, kind: ViewEdge['kind']) => {
    if (a === b || !ids.has(a) || !ids.has(b)) return;
    const key = a < b ? `${a}|${b}` : `${b}|${a}`;
    const edge = pairs.get(key);
    if (!edge) pairs.set(key, { source: a, target: b, kind, weight: 1 });
    else if (edge.kind === kind) edge.weight++;
    else if (kind === 'coauthor') Object.assign(edge, { kind, weight: 1 });
  };
  for (const n of Object.values(graph.notes)) {
    for (let i = 0; i < n.authors.length; i++)
      for (let j = i + 1; j < n.authors.length; j++) add(n.authors[i], n.authors[j], 'coauthor');
  }
  for (const n of Object.values(graph.notes)) {
    for (const t of n.linksTo)
      for (const a of n.authors) for (const b of graph.notes[t].authors) add(a, b, 'builds');
  }

  // A docs page cites a note; drawn as an edge to that note's authors, the same way a note
  // linking to another note becomes a "builds on" edge between their authors.
  const docEdges: ViewEdge[] = [];
  const docNodes: ViewNode[] = [];
  for (const doc of Object.values(graph.docs)) {
    const authorIds = new Set<string>();
    for (const noteId of doc.notes)
      for (const a of graph.notes[noteId]?.authors ?? []) if (ids.has(a)) authorIds.add(a);
    if (!authorIds.size) continue; // nothing in this view to connect it to
    docNodes.push({
      id: doc.id,
      label: doc.title,
      initials: '',
      r: 7 + Math.sqrt(doc.notes.length) * 3.5,
      count: doc.notes.length,
      isNew: false,
      date: '',
      kind: 'doc',
      url: doc.url,
    });
    for (const a of authorIds)
      docEdges.push({ source: doc.id, target: a, kind: 'cites', weight: 1 });
  }

  return { nodes: [...nodes, ...docNodes], edges: [...pairs.values(), ...docEdges], institutions };
}

const endId = (end: string | ViewNode) => (typeof end === 'string' ? end : end.id);

/** A node and everything one edge away. */
export function neighbours(edges: ViewEdge[], id: string): Set<string> {
  const out = new Set([id]);
  for (const e of edges) {
    const s = endId(e.source);
    const t = endId(e.target);
    if (s === id) out.add(t);
    if (t === id) out.add(s);
  }
  return out;
}

/** People matching a search, best first: name starts, then word starts, then anywhere. */
export function findPeople(graph: DevnotesGraph, query: string, limit = 6) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const score = (name: string) => {
    const n = name.toLowerCase();
    if (n.startsWith(q)) return 0;
    if (n.split(/\s+/).some((w) => w.startsWith(q))) return 1;
    return n.includes(q) ? 2 : 3;
  };
  return Object.values(graph.people)
    .filter((p) => !p.group && score(p.name) < 3)
    .sort((a, b) => score(a.name) - score(b.name) || b.notes.length - a.notes.length)
    .slice(0, limit);
}

// ─── Drawing ────────────────────────────────────────────────────────────────────────────

const SVG = 'http://www.w3.org/2000/svg';
const PREFIX = 'dng';

/**
 * Institution colours, by size: the six biggest get a hue, everyone else is grey. Strong
 * enough to carry white initials, and never alone: the legend names them, the panel too.
 */
const PALETTE = ['#f57c00', '#7fb3dc', '#a0522d', '#6a3d9a', '#ef8a94', '#1f6fb2'];
const OTHER = '#a8a8a8';
const NEW = '#2e7d32';
const SELECTED = '#1b5e20';
const DOC = '#8a6d1f';

/** White and technical, like the docs: black ink, grey lines, green for you and the new. */
const CSS = `
.${PREFIX} {
  --ink: #111; --muted: #666; --line: #e3e3e3; --rule: #111; --edge: #9a9a9a;
  --surface: #fff; --soft: #f5f5f5; --accent: #1b5e20; --chip: #f3f7f3;
  position: relative; display: grid; grid-template-columns: 220px minmax(0, 1fr) 320px;
  font: inherit; font-size: 14px; color: var(--ink); background: var(--surface);
  border: 1px solid var(--line); border-top: 2px solid var(--rule); border-radius: 0;
  box-sizing: border-box; overflow: hidden;
}
.${PREFIX}.fill { border: 0; }
.${PREFIX}.dark {
  --ink: #e6edf3; --muted: #9198a1; --line: #30363d; --rule: #e6edf3; --edge: #6e7681;
  --surface: #0d1117; --soft: #161b22; --accent: #3fb950; --chip: #12261a;
}
.${PREFIX} *, .${PREFIX} *::before, .${PREFIX} *::after { box-sizing: border-box; }
.${PREFIX} [hidden] { display: none !important; }
.${PREFIX} a { color: var(--accent); }
.${PREFIX}-side { padding: 16px 14px; border-right: 1px solid var(--line); overflow: auto; }
.${PREFIX}-side h2, .${PREFIX}-panel h2 { margin: 0 0 14px; font-size: 18px; font-weight: 700; line-height: 1.25; }
.${PREFIX}-k {
  display: block; margin: 14px 0 4px; font-size: 12px; letter-spacing: .06em;
  text-transform: uppercase; color: var(--muted);
}
.${PREFIX}-field {
  width: 100%; font: inherit; font-size: 14px; padding: 5px 8px; color: var(--ink);
  background: var(--surface); border: 1px solid #bbb; border-radius: 0;
}
.${PREFIX}.dark .${PREFIX}-field { border-color: var(--line); }
.${PREFIX}-field:focus { outline: 2px solid var(--accent); outline-offset: -1px; }
.${PREFIX}-find { position: relative; }
.${PREFIX}-menu {
  position: absolute; left: 0; right: 0; top: 100%; z-index: 3; margin: 2px 0 0; padding: 0;
  list-style: none; background: var(--surface); border: 1px solid var(--line);
}
.${PREFIX}-menu button, .${PREFIX}-legend button {
  display: flex; align-items: center; gap: 8px; width: 100%; text-align: left; font: inherit;
  font-size: 13px; padding: 5px 8px; color: var(--ink); background: none; border: 0; cursor: pointer;
}
.${PREFIX}-menu button:hover, .${PREFIX}-menu button[aria-selected="true"],
.${PREFIX}-legend button:hover, .${PREFIX}-legend button[aria-pressed="true"] { background: var(--soft); }
.${PREFIX}-menu small, .${PREFIX}-legend small { margin-left: auto; color: var(--muted); font-variant-numeric: tabular-nums; }
.${PREFIX}-legend { margin: 0; padding: 0; list-style: none; }
.${PREFIX}-legend button { padding: 3px 4px; }
.${PREFIX}-legend i { flex: none; width: 12px; height: 12px; border-radius: 50%; }
.${PREFIX}-stats { margin-top: 16px; font-size: 13px; color: var(--muted); line-height: 1.5; }
.${PREFIX}-stats b { color: var(--ink); font-variant-numeric: tabular-nums; }
.${PREFIX}-stage { position: relative; min-height: 0; touch-action: none; cursor: grab; }
.${PREFIX}-stage.panning { cursor: grabbing; }
.${PREFIX}-stage svg { display: block; width: 100%; height: 100%; }
.${PREFIX}-edge { stroke: var(--edge); stroke-opacity: .55; transition: opacity .15s; }
.${PREFIX}-edge.builds { stroke-dasharray: 3 3; stroke-opacity: .4; }
.${PREFIX}-edge.cites { stroke: ${DOC}; stroke-dasharray: 2 3; stroke-opacity: .5; }
.${PREFIX}.hide-docs .${PREFIX}-node.doc, .${PREFIX}.hide-docs .${PREFIX}-edge.cites,
.${PREFIX}.hide-docs .${PREFIX}-label.doc { display: none; }
.${PREFIX}-node { cursor: pointer; }
.${PREFIX}-node:focus { outline: none; }
.${PREFIX}-node:focus-visible .ring { stroke: var(--ink); stroke-dasharray: none; }
.${PREFIX}-node .shape { transform-box: fill-box; transform-origin: center; }
.${PREFIX}-node .disc, .${PREFIX}-node .ring, .${PREFIX}-node text {
  transition: fill-opacity .15s, stroke-opacity .15s;
}
/* An opaque backing circle, so the edges never show through a faded node. */
.${PREFIX}-node .base { fill: var(--surface); }
.${PREFIX}-node .disc { stroke: var(--surface); stroke-width: 1.5; }
.${PREFIX}-node .ring { fill: none; stroke: transparent; stroke-width: 2.5; }
.${PREFIX}-node.new .ring { stroke: ${NEW}; stroke-dasharray: 3 2; }
.${PREFIX}-node.doc .base { fill: var(--surface); }
.${PREFIX}-node.doc .disc { fill-opacity: .25; }
.${PREFIX}-node.doc .ring { stroke: ${DOC}; stroke-dasharray: 2 2; }
.${PREFIX}-node.on .disc { fill: ${SELECTED}; stroke: var(--surface); stroke-width: 2.5; }
.${PREFIX}-node.on .ring { stroke: ${SELECTED}; stroke-dasharray: none; }
.${PREFIX}-node text {
  fill: #fff; font-weight: 700; text-anchor: middle; dominant-baseline: central;
  pointer-events: none; letter-spacing: .01em;
}
.${PREFIX}-label {
  fill: var(--ink); font-size: 10px; text-anchor: middle; pointer-events: none;
  paint-order: stroke; stroke: var(--surface); stroke-linejoin: round;
}
.${PREFIX}.focused .${PREFIX}-edge:not(.near) { opacity: .15; }
.${PREFIX}.focused .${PREFIX}-node:not(.near) .disc { fill-opacity: .18; }
.${PREFIX}.focused .${PREFIX}-node:not(.near) .ring { stroke-opacity: .18; }
.${PREFIX}.focused .${PREFIX}-node:not(.near) text { fill-opacity: .18; }
.${PREFIX}.focused .${PREFIX}-edge.near { stroke-opacity: .9; }
@keyframes ${PREFIX}-ping { 0% { r: var(--r0); opacity: .7; } 100% { r: calc(var(--r0) * 3); opacity: 0; } }
.${PREFIX}-ping { fill: none; stroke: ${NEW}; stroke-width: 2; pointer-events: none;
  animation: ${PREFIX}-ping 1.4s ease-out 3; }
@media (prefers-reduced-motion: reduce) {
  .${PREFIX}-ping { animation: none; }
  .${PREFIX}-node *, .${PREFIX}-edge { transition: none; }
}
.${PREFIX}-tip {
  position: absolute; z-index: 2; max-width: 260px; padding: 6px 9px; pointer-events: none;
  font-size: 12px; line-height: 1.4; background: var(--surface); border: 1px solid var(--line);
}
.${PREFIX}-tip strong { display: block; font-size: 13px; }
.${PREFIX}-tip span { color: var(--muted); }
.${PREFIX}-zoom { position: absolute; right: 10px; bottom: 10px; display: flex; }
.${PREFIX}-zoom button {
  width: 28px; height: 28px; font: inherit; font-size: 15px; line-height: 1; color: var(--ink);
  background: var(--surface); border: 1px solid var(--line); border-radius: 0; cursor: pointer;
}
.${PREFIX}-zoom button + button { border-left: 0; }
.${PREFIX}-zoom button:hover { background: var(--soft); }
.${PREFIX}-msg { position: absolute; inset: 0; display: grid; place-items: center; color: var(--muted); font-size: 13px; }
.${PREFIX}-panel { position: relative; padding: 16px 16px 8px; border-left: 1px solid var(--line); overflow: auto; }
.${PREFIX}-close {
  position: absolute; top: 12px; right: 10px; width: 28px; height: 28px; font: inherit;
  font-size: 20px; line-height: 1; color: var(--ink); background: none; border: 0; cursor: pointer;
}
.${PREFIX}-panel h2 { margin-right: 28px; margin-bottom: 4px; }
.${PREFIX}-meta { font-size: 13px; color: var(--muted); margin-bottom: 10px; }
.${PREFIX}-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.${PREFIX}-chip {
  display: inline-flex; align-items: baseline; gap: 6px; padding: 3px 8px; font-size: 12px;
  font-weight: 600; color: var(--accent); background: var(--surface); border: 1px solid var(--line);
  border-radius: 2px; cursor: default;
}
button.${PREFIX}-chip { font-family: inherit; cursor: pointer; }
button.${PREFIX}-chip:hover { background: var(--chip); }
.${PREFIX}-chip small { font-size: 9px; font-weight: 600; letter-spacing: .06em; color: var(--muted); }
.${PREFIX}-notes { margin: 0; padding: 0; list-style: none; }
.${PREFIX}-notes li { padding: 10px 0; border-top: 1px solid var(--line); }
.${PREFIX}-notes a { display: block; font-weight: 600; line-height: 1.35; color: var(--ink); text-decoration: none; }
.${PREFIX}-notes a:hover { text-decoration: underline; }
.${PREFIX}-notes span { display: block; margin-top: 3px; font-size: 12px; color: var(--muted); }
.${PREFIX}-h { margin: 14px 0 6px; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.${PREFIX}.narrow { grid-template-columns: minmax(0, 1fr); grid-template-rows: auto auto auto; }
.${PREFIX}.narrow .${PREFIX}-side { border-right: 0; border-bottom: 1px solid var(--line); }
.${PREFIX}.narrow .${PREFIX}-side .${PREFIX}-wide { display: none; }
.${PREFIX}.narrow .${PREFIX}-panel { border-left: 0; border-top: 1px solid var(--line); }
`;

function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  text?: string,
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (text != null) el.textContent = text;
  return el;
}

function s<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

const escape = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

const STORE = (site: string) => `devnotes-graph:${site}`;

function remember(key: string, value: string | null) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // Storage blocked: nothing to remember, nothing lost.
  }
}
function recall(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

type ColorBy = 'institution' | 'new';

/** Draw the graph in `el`. Returns a cleanup function. */
export function mount(el: HTMLElement, options: DevnotesGraphOptions = {}): () => void {
  const o: Resolved = { ...DEFAULTS, ...stripUndefined(options) };
  const abort = new AbortController();
  const timers: number[] = [];

  const style = h('style', {}, CSS);
  const root = h('div', { class: PREFIX });
  const cssHeight = typeof o.height === 'number' ? `${o.height}px` : o.height;
  const graphHeight = typeof o.height === 'number' ? o.height : 640;
  root.style.height = cssHeight;
  root.classList.toggle('fill', typeof o.height === 'string');

  // Left: find yourself, colour key, totals.
  const side = h('div', { class: `${PREFIX}-side` });
  const title = h('h2', { class: `${PREFIX}-wide` }, 'Network graph');
  const findLabel = h('label', { class: `${PREFIX}-k` }, 'Find yourself');
  const find = h('div', { class: `${PREFIX}-find` });
  const input = h('input', {
    class: `${PREFIX}-field`,
    type: 'search',
    placeholder: 'Your name',
    'aria-label': 'Find a person',
    autocomplete: 'off',
  });
  const menu = h('ul', { class: `${PREFIX}-menu`, role: 'listbox', hidden: '' });
  find.append(input, menu);
  const colorLabel = h('label', { class: `${PREFIX}-k ${PREFIX}-wide` }, 'Color by');
  const colorSelect = h('select', {
    class: `${PREFIX}-field ${PREFIX}-wide`,
    'aria-label': 'Color by',
  });
  colorSelect.append(
    h('option', { value: 'institution' }, 'Institution'),
    h('option', { value: 'new' }, 'New contributors'),
  );
  // Hidden until a build finds at least one docs page citing a note (see `fetchDocCitations`).
  // Not `-wide`, unlike "Color by": narrow mode still drops the legend, but the one thing
  // that actually changes what's drawn stays reachable at any width.
  const docsToggle = h('input', { type: 'checkbox', checked: '' });
  const docsLabel = h('label', { class: `${PREFIX}-k`, hidden: '' });
  docsLabel.append(docsToggle, document.createTextNode(' Docs pages that cite a note'));
  const legend = h('ul', { class: `${PREFIX}-legend ${PREFIX}-wide` });
  const stats = h('div', { class: `${PREFIX}-stats`, 'aria-live': 'polite' }, 'Loading dev notes…');
  legend.style.marginTop = '8px';
  side.append(title, findLabel, find, colorLabel, colorSelect, docsLabel, legend, stats);

  // Middle: the graph.
  const stage = h('div', { class: `${PREFIX}-stage` });
  const svg = s('svg', { role: 'img', 'aria-label': 'Who wrote dev notes with whom' });
  const viewport = s('g');
  const edgeLayer = s('g');
  const nodeLayer = s('g');
  const labelLayer = s('g');
  viewport.append(edgeLayer, nodeLayer, labelLayer);
  svg.append(viewport);
  const tip = h('div', { class: `${PREFIX}-tip`, hidden: '' });
  const zoom = h('div', { class: `${PREFIX}-zoom` });
  const zoomIn = h('button', { type: 'button', 'aria-label': 'Zoom in' }, '+');
  const zoomOut = h('button', { type: 'button', 'aria-label': 'Zoom out' }, '−');
  const zoomFit = h('button', { type: 'button', 'aria-label': 'Fit the graph' }, '⤢');
  zoom.append(zoomIn, zoomOut, zoomFit);
  const msg = h('div', { class: `${PREFIX}-msg` }, 'Loading dev notes…');
  stage.append(svg, tip, zoom, msg);

  // Right: the person you picked, or what's new.
  const panel = h('div', { class: `${PREFIX}-panel`, 'aria-live': 'polite' });

  root.append(side, stage, panel);
  el.append(style, root);

  // Follow the page's dark mode (the theme sets `dark` on <html>), unless told otherwise.
  const syncTheme = () =>
    root.classList.toggle(
      'dark',
      o.theme === 'auto' ? document.documentElement.classList.contains('dark') : o.theme === 'dark',
    );
  syncTheme();
  const themeObserver = new MutationObserver(syncTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // State.
  let graph: DevnotesGraph | null = null;
  let view: GraphView = { nodes: [], edges: [], institutions: [] };
  const byId = new Map<string, ViewNode>();
  const nodeEls = new Map<string, SVGGElement>();
  const labelEls = new Map<string, SVGTextElement>();
  let edgeEls: { edge: ViewEdge; el: SVGLineElement }[] = [];
  let simulation: Simulation<ViewNode, ViewEdge> | null = null;
  let hovered: string | null = null;
  let selected: string | null = null;
  let institution: string | null = null;
  let colorBy: ColorBy = 'institution';
  let me = o.highlight ?? recall(`${STORE(o.site)}:me`) ?? null;
  let t = { x: 0, y: 0, k: 1 };

  const colorOf = (n: ViewNode) => {
    if (n.kind === 'doc') return DOC;
    if (colorBy === 'new') return n.isNew ? NEW : OTHER;
    const k = view.institutions.findIndex((i) => i.id === n.institution);
    return k >= 0 && k < PALETTE.length ? PALETTE[k] : OTHER;
  };

  const size = () => ({ w: stage.clientWidth || 600, h: stage.clientHeight || graphHeight });
  const applyTransform = () => {
    const { w, h: hh } = size();
    viewport.setAttribute('transform', `translate(${w / 2 + t.x},${hh / 2 + t.y}) scale(${t.k})`);
    updateLabels();
  };

  function fit(ids?: Set<string>) {
    const nodes = view.nodes.filter((n) => !ids || ids.has(n.id));
    if (!nodes.length) return;
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const n of nodes) {
      x0 = Math.min(x0, n.x! - n.r);
      y0 = Math.min(y0, n.y! - n.r);
      x1 = Math.max(x1, n.x! + n.r);
      y1 = Math.max(y1, n.y! + n.r + 14);
    }
    const { w, h: hh } = size();
    const pad = 32;
    const k = Math.min(
      ids ? 1.8 : 2.4,
      Math.max(0.2, Math.min((w - pad * 2) / (x1 - x0 || 1), (hh - pad * 2) / (y1 - y0 || 1))),
    );
    t = { k, x: -((x0 + x1) / 2) * k, y: -((y0 + y1) / 2) * k };
    applyTransform();
  }

  /** The current focus: who you're hovering or picked, or an institution's people. */
  const focusSet = (): Set<string> | null => {
    const id = hovered ?? selected;
    if (id) return neighbours(view.edges, id);
    if (institution)
      return new Set(
        view.nodes
          .filter((n) => graph?.people[n.id]?.institutions.includes(institution!))
          .map((n) => n.id),
      );
    return null;
  };

  /**
   * Names under the circles, the same size on screen at any zoom: everyone in focus, or
   * else the most prolific that fit without overlapping (you and the newest first).
   */
  function updateLabels() {
    const focus = hovered ?? selected;
    const near = focusSet();
    const fs = 10 / t.k;
    const rank = (n: ViewNode) => (n.id === focus ? 0 : n.id === me ? 1 : n.isNew ? 2 : 3);
    const candidates = view.nodes
      .filter((n) => (near ? near.has(n.id) : true))
      .sort((a, b) => rank(a) - rank(b) || b.count - a.count)
      .slice(0, near ? undefined : Math.max(6, Math.round(view.nodes.length / 6) * t.k));
    const shown = new Set<string>();
    const placed: [number, number, number, number][] = [];
    for (const n of candidates) {
      const label = labelEls.get(n.id)!;
      const w = (label.textContent?.length ?? 0) * fs * 0.55;
      const y = n.y! + n.r + fs * 1.15;
      const box: [number, number, number, number] = [
        n.x! - w / 2,
        y - fs,
        n.x! + w / 2,
        y + fs * 0.3,
      ];
      const clear = placed.every(
        (b) => box[0] > b[2] || box[2] < b[0] || box[1] > b[3] || box[3] < b[1],
      );
      if (!clear && rank(n) > 1) continue;
      placed.push(box);
      shown.add(n.id);
      label.setAttribute('x', String(n.x));
      label.setAttribute('y', String(y));
      label.style.fontSize = `${fs}px`;
      label.style.strokeWidth = `${3 / t.k}px`;
    }
    for (const [id, label] of labelEls) label.style.display = shown.has(id) ? '' : 'none';
  }

  function position() {
    for (const { edge, el: line } of edgeEls) {
      const a = edge.source as ViewNode;
      const b = edge.target as ViewNode;
      line.setAttribute('x1', String(a.x));
      line.setAttribute('y1', String(a.y));
      line.setAttribute('x2', String(b.x));
      line.setAttribute('y2', String(b.y));
    }
    for (const [id, g] of nodeEls) {
      const n = byId.get(id)!;
      g.setAttribute('transform', `translate(${n.x},${n.y})`);
    }
    updateLabels();
  }

  function paint() {
    for (const [id, g] of nodeEls) {
      g.querySelector<SVGCircleElement>('.disc')!.setAttribute('fill', colorOf(byId.get(id)!));
    }
    drawLegend();
  }

  function setFocus() {
    const focus = hovered ?? selected;
    const near = focusSet();
    root.classList.toggle('focused', !!near);
    for (const [id, g] of nodeEls) {
      g.classList.toggle('near', !!near?.has(id));
      g.classList.toggle('on', id === selected || (!selected && id === me));
    }
    for (const { edge, el: line } of edgeEls) {
      const a = endId(edge.source);
      const b = endId(edge.target);
      line.classList.toggle(
        'near',
        focus ? a === focus || b === focus : !!near && near.has(a) && near.has(b),
      );
    }
    updateLabels();
  }

  function drawLegend() {
    if (!graph) return;
    const items =
      colorBy === 'new'
        ? [
            {
              id: '',
              name: `New in the last ${o.newDays} days`,
              people: view.nodes.filter((n) => n.isNew).length,
              color: NEW,
            },
          ]
        : [
            ...view.institutions
              .slice(0, PALETTE.length)
              .map((i, k) => ({ ...i, color: PALETTE[k] })),
            {
              id: '',
              name: 'Elsewhere',
              people: view.nodes.filter(
                (n) =>
                  n.kind === 'person' &&
                  (view.institutions.findIndex((i) => i.id === n.institution) < 0 ||
                    view.institutions.findIndex((i) => i.id === n.institution) >= PALETTE.length),
              ).length,
              color: OTHER,
            },
            ...(view.nodes.some((n) => n.kind === 'doc')
              ? [
                  {
                    id: '',
                    name: 'Docs pages',
                    people: view.nodes.filter((n) => n.kind === 'doc').length,
                    color: DOC,
                  },
                ]
              : []),
          ];
    legend.replaceChildren(
      ...items.map((item) => {
        const li = h('li');
        const button = h('button', {
          type: 'button',
          'aria-pressed': String(!!item.id && item.id === institution),
        });
        const dot = h('i');
        dot.style.background = item.color;
        button.append(dot, document.createTextNode(item.name), h('small', {}, String(item.people)));
        if (item.id) {
          button.addEventListener('click', () => {
            institution = institution === item.id ? null : item.id;
            selected = null;
            if (institution) {
              const set = focusSet();
              if (set?.size) fit(set);
            }
            setFocus();
            showPanel();
            drawLegend();
          });
        } else button.disabled = true;
        li.append(button);
        return li;
      }),
    );
  }

  const noteItem = (id: string) => {
    const n = graph!.notes[id];
    const collection = graph!.collections[n.collection]?.title;
    return `<li><a href="${escape(n.url)}">${escape(n.title)}</a><span>${collection ? `${escape(collection)} · ` : ''}${formatDate(n.date)}</span></li>`;
  };

  function showPanel() {
    if (!graph) return;
    const doc = selected ? graph.docs[selected] : null;
    if (doc) {
      panel.innerHTML =
        `<button type="button" class="${PREFIX}-close" aria-label="Close">×</button>` +
        `<h2>${escape(doc.title)}</h2>` +
        `<div class="${PREFIX}-meta">Docs page · ${plural(doc.notes.length, 'note')} cited · <a href="${escape(doc.url)}">Open</a></div>` +
        `<ul class="${PREFIX}-notes">${doc.notes.slice().reverse().map(noteItem).join('')}</ul>`;
      panel.querySelector(`.${PREFIX}-close`)!.addEventListener('click', () => {
        selected = null;
        setFocus();
        showPanel();
      });
      return;
    }
    const p = selected ? graph.people[selected] : null;
    if (p) {
      const node = byId.get(p.id);
      const coauthors = neighbours(view.edges, p.id).size - 1;
      const links = p.orcid ? [`<a href="https://orcid.org/${escape(p.orcid)}">ORCID</a>`] : [];
      const collections = [...new Set(p.notes.map((n) => graph!.notes[n]?.collection))]
        .map((c) => graph!.collections[c]?.title)
        .filter(Boolean) as string[];
      const insts = p.institutions.map((i) => graph!.institutions[i]).filter(Boolean);
      panel.innerHTML =
        `<button type="button" class="${PREFIX}-close" aria-label="Close">×</button>` +
        `<h2>${escape(p.name)}</h2>` +
        `<div class="${PREFIX}-meta">${[plural(p.notes.length, 'note'), plural(coauthors, 'collaborator'), `since ${formatDate(p.firstDate)}`, ...links].join(' · ')}</div>` +
        `<div class="${PREFIX}-chips">` +
        (node?.isNew ? `<span class="${PREFIX}-chip"><small>NEW</small>contributor</span>` : '') +
        insts
          .map(
            (i) =>
              `<button type="button" class="${PREFIX}-chip" data-inst="${escape(i.id)}"><small>INSTITUTION</small>${escape(i.name)}</button>`,
          )
          .join('') +
        collections
          .map((c) => `<span class="${PREFIX}-chip"><small>COLLECTION</small>${escape(c)}</span>`)
          .join('') +
        `</div>` +
        `<ul class="${PREFIX}-notes">${p.notes.slice().reverse().map(noteItem).join('')}</ul>`;
      panel.querySelector(`.${PREFIX}-close`)!.addEventListener('click', () => {
        selected = null;
        setFocus();
        showPanel();
      });
      for (const chip of panel.querySelectorAll<HTMLButtonElement>('[data-inst]')) {
        chip.addEventListener('click', () => {
          institution = chip.dataset.inst!;
          selected = null;
          const set = focusSet();
          if (set?.size) fit(set);
          setFocus();
          showPanel();
          drawLegend();
        });
      }
      return;
    }
    if (institution) {
      const inst = graph.institutions[institution];
      panel.innerHTML =
        `<button type="button" class="${PREFIX}-close" aria-label="Close">×</button>` +
        `<h2>${escape(inst?.name ?? '')}</h2>` +
        `<div class="${PREFIX}-meta">${plural(inst?.people.length ?? 0, 'person', 'people')} · ${plural(inst?.notes.length ?? 0, 'note')}</div>` +
        (inst?.labs.length
          ? `<div class="${PREFIX}-chips">${inst.labs.map((l) => `<span class="${PREFIX}-chip"><small>LAB</small>${escape(l)}</span>`).join('')}</div>`
          : '') +
        `<ul class="${PREFIX}-notes">${(inst?.notes ?? []).slice().reverse().map(noteItem).join('')}</ul>`;
      panel.querySelector(`.${PREFIX}-close`)!.addEventListener('click', () => {
        institution = null;
        setFocus();
        showPanel();
        drawLegend();
      });
      return;
    }
    const newcomers = Object.values(graph.people)
      .filter((q) => byId.get(q.id)?.isNew)
      .sort((a, b) => b.firstDate.localeCompare(a.firstDate));
    const latest = Object.values(graph.notes)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8)
      .map((n) => n.id);
    panel.innerHTML =
      `<h2>${escape(graph.site.title || 'Dev notes')}</h2>` +
      `<div class="${PREFIX}-meta">Every circle is someone who wrote a dev note. Pick one to see their notes, or find yourself.</div>` +
      (newcomers.length
        ? `<div class="${PREFIX}-h">New contributors</div><div class="${PREFIX}-chips">${newcomers
            .map(
              (q) =>
                `<button type="button" class="${PREFIX}-chip" data-person="${escape(q.id)}">${escape(q.name)}</button>`,
            )
            .join('')}</div>`
        : '') +
      `<div class="${PREFIX}-h">Latest notes</div><ul class="${PREFIX}-notes">${latest.map(noteItem).join('')}</ul>`;
    for (const chip of panel.querySelectorAll<HTMLButtonElement>('[data-person]')) {
      chip.addEventListener('click', () => pick(chip.dataset.person!, true));
    }
  }

  function showTip(id: string | null, at?: { x: number; y: number }) {
    if (!id || !graph || !at) {
      tip.hidden = true;
      return;
    }
    const doc = graph.docs[id];
    if (doc) {
      tip.innerHTML = `<strong>${escape(doc.title)}</strong><span>${plural(doc.notes.length, 'note')} cited · docs page</span>`;
    } else {
      const p = graph.people[id];
      const inst = p.institutions.map((i) => graph!.institutions[i]?.name)[0];
      tip.innerHTML = `<strong>${escape(p.name)}</strong><span>${plural(p.notes.length, 'note')}${inst ? ` · ${escape(inst)}` : ''}</span>`;
    }
    tip.hidden = false;
    const { w } = size();
    tip.style.left = `${Math.max(4, Math.min(at.x + 14, w - 270))}px`;
    tip.style.top = `${at.y + 14}px`;
  }

  /** Where a node is on screen, relative to the stage. */
  const screen = (n: ViewNode) => {
    const { w, h: hh } = size();
    return { x: w / 2 + t.x + n.x! * t.k, y: hh / 2 + t.y + n.y! * t.k };
  };

  function ping(id: string) {
    const n = byId.get(id);
    const g = nodeEls.get(id);
    if (!n || !g) return;
    const ring = s('circle', { class: `${PREFIX}-ping`, r: n.r, style: `--r0:${n.r}px` });
    g.prepend(ring);
    timers.push(window.setTimeout(() => ring.remove(), 4400));
  }

  /** Select someone, zoom to them and their collaborators. */
  function pick(id: string, zoomTo: boolean) {
    hovered = null;
    institution = null;
    selected = id;
    if (zoomTo) fit(neighbours(view.edges, id));
    setFocus();
    showPanel();
    drawLegend();
  }

  function findPerson(id: string) {
    me = id;
    remember(`${STORE(o.site)}:me`, id);
    pick(id, true);
  }

  /** Draw `next`, keeping where everyone already was; anyone new pops in. */
  function render(next: DevnotesGraph, first: boolean) {
    const today = new Date().toISOString().slice(0, 10);
    const old = new Map(view.nodes.map((n) => [n.id, n]));
    graph = next;
    view = graphView(next, today, o.newDays);
    byId.clear();
    for (const n of view.nodes) byId.set(n.id, n);
    const fresh = new Set(
      old.size ? view.nodes.filter((n) => !old.has(n.id)).map((n) => n.id) : [],
    );

    // Start where they were, or next to a collaborator, or on a spiral by date.
    const sorted = [...view.nodes].sort((a, b) => a.date.localeCompare(b.date));
    sorted.forEach((n, i) => {
      const prev = old.get(n.id);
      if (prev) {
        n.x = prev.x;
        n.y = prev.y;
        return;
      }
      const tie = [...neighbours(view.edges, n.id)].map((id) => old.get(id)).find(Boolean);
      const angle = i * 2.399963;
      const dist = 16 * Math.sqrt(i + 1);
      n.x = tie ? tie.x! + Math.cos(angle) * 24 : Math.cos(angle) * dist;
      n.y = tie ? tie.y! + Math.sin(angle) * 24 : Math.sin(angle) * dist;
    });

    simulation?.stop();
    simulation = forceSimulation<ViewNode>(view.nodes)
      .force(
        'link',
        forceLink<ViewNode, ViewEdge>(view.edges)
          .id((n) => n.id)
          .distance(
            (e) =>
              (e.source as ViewNode).r +
              (e.target as ViewNode).r +
              (e.kind === 'coauthor' ? 30 : 60),
          )
          .strength((e) => (e.kind === 'coauthor' ? Math.min(1, 0.35 + e.weight * 0.15) : 0.08)),
      )
      .force(
        'charge',
        forceManyBody<ViewNode>()
          .strength((n) => -60 - n.r * 6)
          .distanceMax(400),
      )
      .force('collide', forceCollide<ViewNode>((n) => n.r + 3).iterations(2))
      .force('x', forceX<ViewNode>(0).strength(0.06))
      .force('y', forceY<ViewNode>(0).strength(0.08))
      .on('tick', position)
      .stop();
    // Settle first, so the graph arrives still and readable; a refresh moves gently.
    const ticks = old.size ? 60 : 320;
    if (old.size) simulation.alpha(0.3);
    for (let i = 0; i < ticks; i++) simulation.tick();

    edgeLayer.replaceChildren();
    nodeLayer.replaceChildren();
    labelLayer.replaceChildren();
    nodeEls.clear();
    labelEls.clear();
    edgeEls = view.edges.map((edge) => {
      const line = s('line', {
        class: `${PREFIX}-edge ${edge.kind}`,
        'stroke-width': Math.min(4, 0.7 + (edge.weight - 1) * 0.6),
      });
      edgeLayer.append(line);
      return { edge, el: line };
    });
    // Smallest underneath, so the big circles stay readable; the newest on top of equals.
    const order = [...view.nodes].sort((a, b) => a.r - b.r || a.date.localeCompare(b.date));
    const byArrival = [...view.nodes].sort((a, b) => a.date.localeCompare(b.date));
    for (const n of order) {
      const g = s('g', {
        class: `${PREFIX}-node${n.isNew ? ' new' : ''}${n.kind === 'doc' ? ' doc' : ''}`,
        tabindex: 0,
        role: 'button',
        'aria-label': n.kind === 'doc' ? `${n.label} (docs page)` : n.label,
      });
      const shape = s('g', { class: 'shape' });
      shape.append(
        s('circle', { class: 'ring', r: n.r + 3 }),
        s('circle', { class: 'base', r: n.r }),
        s('circle', { class: 'disc', r: n.r }),
      );
      const text = s('text');
      text.style.fontSize = `${Math.max(4.5, n.r * 0.72)}px`;
      text.textContent = n.kind === 'doc' ? '' : n.initials;
      shape.append(text);
      g.append(shape);
      // On first load the circles pop in, oldest first; on a refresh, only the new ones.
      if (first || fresh.has(n.id)) {
        g.classList.add('pop');
        const delay = first ? (byArrival.indexOf(n) / Math.max(1, byArrival.length)) * 1.2 : 0;
        (shape as SVGGElement).style.animationDelay = `${delay.toFixed(2)}s`;
      }
      nodeLayer.append(g);
      nodeEls.set(n.id, g);
      const label = s('text', { class: `${PREFIX}-label${n.kind === 'doc' ? ' doc' : ''}` });
      label.textContent = n.label;
      labelLayer.append(label);
      labelEls.set(n.id, label);
    }
    position();
    paint();
    msg.hidden = true;

    const notes = Object.keys(next.notes).length;
    const docCount = view.nodes.filter((n) => n.kind === 'doc').length;
    docsLabel.hidden = !docCount;
    stats.innerHTML =
      `<b>${view.nodes.filter((n) => n.kind === 'person').length}</b> people · <b>${view.edges.filter((e) => e.kind === 'coauthor').length}</b> collaborations<br>` +
      `<b>${notes}</b> dev notes · <b>${Object.keys(next.institutions).length}</b> institutions` +
      (docCount ? ` · <b>${docCount}</b> docs pages` : '') +
      (next.range[1] ? `<br>Latest ${formatDate(next.range[1])}` : '');

    if (selected && !byId.has(selected)) selected = null;
    if (first) {
      fit();
      if (me && !next.people[me]) me = findPeople(next, me, 1)[0]?.id ?? null;
      if (me && byId.has(me)) {
        input.value = next.people[me].name;
        selected = me;
        fit(neighbours(view.edges, me));
      }
    } else if (fresh.size) {
      // Let the new arrivals settle into place where you can see it.
      simulation.alpha(0.25).restart();
      for (const id of fresh) ping(id);
      applyTransform();
    }
    setFocus();
    showPanel();
  }

  // Interaction: hover, select, drag a node, pan the background, zoom.
  const nodeAt = (target: EventTarget | null) => {
    let node = target as Element | null;
    while (node && node !== svg) {
      for (const [id, g] of nodeEls) if (g === node) return id;
      node = node.parentElement;
    }
    return null;
  };
  const stagePoint = (e: { clientX: number; clientY: number }) => {
    const rect = stage.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  let drag: {
    id: string | null;
    x: number;
    y: number;
    tx: number;
    ty: number;
    moved: boolean;
  } | null = null;
  svg.addEventListener('pointerdown', (e) => {
    const id = nodeAt(e.target);
    const p = stagePoint(e);
    drag = { id, x: p.x, y: p.y, tx: t.x, ty: t.y, moved: false };
    svg.setPointerCapture(e.pointerId);
    if (!id) stage.classList.add('panning');
  });
  svg.addEventListener('pointermove', (e) => {
    const p = stagePoint(e);
    if (drag) {
      const dx = p.x - drag.x;
      const dy = p.y - drag.y;
      if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
      if (!drag.moved) return;
      if (drag.id) {
        const n = byId.get(drag.id)!;
        const { w, h: hh } = size();
        n.fx = (p.x - w / 2 - t.x) / t.k;
        n.fy = (p.y - hh / 2 - t.y) / t.k;
        simulation?.alphaTarget(0.2).restart();
        tip.hidden = true;
      } else {
        t = { ...t, x: drag.tx + dx, y: drag.ty + dy };
        applyTransform();
      }
      return;
    }
    const id = nodeAt(e.target);
    if (id !== hovered) {
      hovered = id;
      setFocus();
    }
    showTip(id, id ? p : undefined);
  });
  const endDrag = (e: PointerEvent) => {
    if (!drag) return;
    const { id, moved } = drag;
    drag = null;
    stage.classList.remove('panning');
    if (svg.hasPointerCapture(e.pointerId)) svg.releasePointerCapture(e.pointerId);
    if (id && moved) {
      const n = byId.get(id)!;
      n.fx = null;
      n.fy = null;
      simulation?.alphaTarget(0);
      return;
    }
    if (moved) return;
    if (id && id !== selected) {
      pick(id, false);
      return;
    }
    selected = null;
    institution = null;
    setFocus();
    showPanel();
    drawLegend();
  };
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);
  svg.addEventListener('pointerleave', () => {
    if (drag) return;
    hovered = null;
    tip.hidden = true;
    setFocus();
  });
  svg.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const id = nodeAt(e.target);
    if (!id) return;
    e.preventDefault();
    pick(id, false);
  });
  svg.addEventListener('focusin', (e) => {
    const id = nodeAt(e.target);
    if (id) showTip(id, screen(byId.get(id)!));
  });
  svg.addEventListener('focusout', () => (tip.hidden = true));

  const zoomBy = (factor: number, at?: { x: number; y: number }) => {
    const { w, h: hh } = size();
    const p = at ?? { x: w / 2, y: hh / 2 };
    const k = Math.min(6, Math.max(0.2, t.k * factor));
    const f = k / t.k;
    // Keep the point under the cursor where it is.
    const cx = p.x - w / 2;
    const cy = p.y - hh / 2;
    t = { k, x: cx - (cx - t.x) * f, y: cy - (cy - t.y) * f };
    applyTransform();
  };
  svg.addEventListener(
    'wheel',
    (e) => {
      // Scroll the page as usual; zoom only with a modifier or a trackpad pinch.
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoomBy(Math.exp(-e.deltaY * 0.01), stagePoint(e));
    },
    { passive: false },
  );
  zoomIn.addEventListener('click', () => zoomBy(1.3));
  zoomOut.addEventListener('click', () => zoomBy(1 / 1.3));
  zoomFit.addEventListener('click', () => fit());

  colorSelect.addEventListener('change', () => {
    colorBy = colorSelect.value as ColorBy;
    institution = null;
    paint();
    setFocus();
    showPanel();
  });

  docsToggle.addEventListener('change', () => {
    root.classList.toggle('hide-docs', !docsToggle.checked);
    if (!docsToggle.checked && selected && graph?.docs[selected]) {
      selected = null;
      setFocus();
      showPanel();
    }
  });

  // Find yourself.
  let matches: { id: string; name: string }[] = [];
  let active = 0;
  const closeMenu = () => {
    menu.hidden = true;
    matches = [];
  };
  const drawMenu = () => {
    menu.replaceChildren(
      ...matches.map((p, i) => {
        const li = h('li');
        const button = h('button', {
          type: 'button',
          role: 'option',
          'aria-selected': String(i === active),
        });
        const notes = graph?.people[p.id]?.notes.length ?? 0;
        button.textContent = p.name;
        button.append(h('small', {}, plural(notes, 'note')));
        button.addEventListener('mousedown', (e) => {
          e.preventDefault();
          choose(i);
        });
        li.append(button);
        return li;
      }),
    );
    menu.hidden = !matches.length;
  };
  const choose = (i: number) => {
    const p = matches[i];
    if (!p) return;
    input.value = p.name;
    closeMenu();
    findPerson(p.id);
  };
  input.addEventListener('input', () => {
    matches = graph ? findPeople(graph, input.value).map((p) => ({ id: p.id, name: p.name })) : [];
    active = 0;
    drawMenu();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      active =
        (active + (e.key === 'ArrowDown' ? 1 : -1) + matches.length) % Math.max(1, matches.length);
      drawMenu();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(active);
    } else if (e.key === 'Escape') {
      closeMenu();
    }
  });
  input.addEventListener('blur', closeMenu);

  // Narrow: the three columns stack, and the graph gets a height of its own.
  // The graph can be drawn (from the snapshot or this browser's cache) before the page has
  // laid it out, so the first real size gets a fit too.
  let measured = false;
  const resize = new ResizeObserver(() => {
    if (!root.clientWidth) return;
    const narrow = root.clientWidth < 820;
    const changed = narrow !== root.classList.contains('narrow') || !measured;
    measured = true;
    root.classList.toggle('narrow', narrow);
    root.style.height = narrow ? '' : cssHeight;
    stage.style.height = narrow
      ? `${Math.min(graphHeight, Math.max(360, root.clientWidth))}px`
      : '';
    // A new layout gets a new fit; otherwise keep where you've panned to.
    if (changed && view.nodes.length) fit(selected ? neighbours(view.edges, selected) : undefined);
    else applyTransform();
  });
  resize.observe(root);

  // Load: the newer of the last graph in this browser and the one baked in at build time,
  // at once; then the live one.
  const cacheKey = STORE(o.site);
  let shown = false;
  let cached: DevnotesGraphSnapshot | undefined;
  try {
    const json = recall(cacheKey);
    if (json) cached = JSON.parse(json) as DevnotesGraphSnapshot;
  } catch {
    remember(cacheKey, null);
  }
  const built = o.snapshot ?? BUILT_SNAPSHOT;
  const snapshot = built?.site === o.site ? built : undefined;
  const first = snapshot && !(cached && cached.savedAt > snapshot.savedAt) ? snapshot : cached;
  if (first?.graph) {
    try {
      render(first.graph, true);
      shown = true;
    } catch {
      remember(cacheKey, null);
    }
  }
  const refresh = async () => {
    try {
      const next = await loadDevnotesGraph(o, abort.signal);
      if (abort.signal.aborted) return;
      const json = JSON.stringify(next);
      if (!shown || json !== JSON.stringify(graph)) render(next, !shown);
      shown = true;
      remember(
        cacheKey,
        JSON.stringify({ site: o.site, savedAt: new Date().toISOString(), graph: next }),
      );
    } catch (error) {
      if (abort.signal.aborted) return;
      if (!shown) {
        msg.textContent = 'The dev notes could not be loaded. Try again in a moment.';
        stats.textContent = '';
      }
      console.warn('[devnotes-graph]', error);
    }
  };
  void refresh();
  if (o.refresh > 0) timers.push(window.setInterval(refresh, o.refresh * 1000));

  return () => {
    abort.abort();
    for (const id of timers) {
      window.clearInterval(id);
      window.clearTimeout(id);
    }
    simulation?.stop();
    resize.disconnect();
    themeObserver.disconnect();
    style.remove();
    root.remove();
  };
}

function stripUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v != null)) as Partial<T>;
}

/** The anywidget model's options; keys may be camelCase or snake_case. */
interface Model {
  get(key: string): unknown;
}
function readModel(model: Model): DevnotesGraphOptions {
  const get = (...keys: string[]) => keys.map((k) => model.get(k)).find((v) => v != null);
  const num = (v: unknown) => (v == null || v === '' ? undefined : Number(v));
  const list = (v: unknown) => (Array.isArray(v) ? v.map(String) : undefined);
  return {
    site: get('site') as string | undefined,
    api: get('api') as string | undefined,
    height: (() => {
      const height = get('height');
      return typeof height === 'string' && Number.isNaN(Number(height)) ? height : num(height);
    })(),
    refresh: num(get('refresh')),
    newDays: num(get('newDays', 'new_days')),
    noteHosts: list(get('noteHosts', 'note_hosts')),
    docHosts: list(get('docHosts', 'doc_hosts')),
    highlight: get('highlight') as string | undefined,
    theme: get('theme') as DevnotesGraphOptions['theme'],
  };
}

/** The anywidget entry point: `render({ model, el })`. */
export default {
  render({ model, el }: { model: Model; el: HTMLElement }) {
    return mount(el, readModel(model));
  },
};
