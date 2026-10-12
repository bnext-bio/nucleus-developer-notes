/**
 * Dev Notes Graph: the notes on an SCMS site, the people who wrote them, where they
 * work, and how the notes link to each other and to the docs — as one graph.
 *
 * Pure: `buildDevnotesGraph` takes what `loadDevnotesGraph` (in `widget.ts`) fetched (each work, its CDN
 * project config, and the links and summary read from its page) and returns the graph
 * the page draws. Real data is messy, so most of this is merging: authors written three
 * ways, one ORCID pasted under two people, forty spellings of fifteen institutions.
 */

/** A work as `GET /v1/sites/:site/works` lists it (the fields used here). */
export interface ScmsWork {
  id: string;
  slug?: string | null;
  key?: string | null;
  doi?: string | null;
  title: string;
  authors?: { name?: string }[];
  date_published?: string;
  date?: string;
  cdn?: string;
  cdn_key?: string;
  collection?: { slug: string; content?: { title?: string; description?: string } };
  links?: { html?: string; config?: string };
}

/** A collection as `GET /v1/sites/:site/collections` lists it. */
export interface ScmsCollection {
  slug: string;
  content?: { title?: string; description?: string };
}

/** `projects[0]` of a work's CDN `config.json` (the fields used here). */
export interface CdnProject {
  title?: string;
  keywords?: string[];
  thumbnailOptimized?: string;
  thumbnail?: string;
  authors?: {
    name?: string;
    orcid?: string;
    corresponding?: boolean;
    affiliations?: string[];
  }[];
  affiliations?: { id: string; name?: string; department?: string }[];
}

export interface RawNote {
  work: ScmsWork;
  project: CdnProject | null;
  /** Every `url` in the page's mdast. */
  links: string[];
  /** The abstract, or the first paragraph, as plain text. */
  summary?: string;
}

export interface SiteInfo {
  name: string;
  title: string;
  tagline?: string;
  url: string;
  logo?: string;
  logoDark?: string;
}

export type NodeKind = 'note' | 'person' | 'institution' | 'collection' | 'keyword' | 'doc';
export type EdgeKind = 'link' | 'author' | 'affiliation' | 'collection' | 'keyword' | 'doc';

export interface Note {
  id: string;
  title: string;
  date: string;
  summary?: string;
  thumbnail?: string;
  /** The note on the live site. */
  url: string;
  doi?: string;
  collection: string;
  authors: string[];
  institutions: string[];
  keywords: string[];
  /** Notes this one links to, and notes that link here. */
  linksTo: string[];
  linkedFrom: string[];
  docs: string[];
}

export interface Person {
  id: string;
  name: string;
  orcid?: string;
  /** A workshop, a working group or an agent rather than a person. */
  group: boolean;
  notes: string[];
  institutions: string[];
  /** Their first note, and when. */
  firstNote: string;
  firstDate: string;
}

export interface Institution {
  id: string;
  name: string;
  labs: string[];
  people: string[];
  notes: string[];
  firstDate: string;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description?: string;
  notes: string[];
}

export interface Doc {
  id: string;
  url: string;
  title: string;
  notes: string[];
}

export interface Keyword {
  id: string;
  label: string;
  notes: string[];
}

export interface Edge {
  source: string;
  target: string;
  kind: EdgeKind;
  /** When the edge first exists: the later of its ends' dates. */
  date: string;
}

export interface DevnotesGraph {
  site: SiteInfo;
  notes: Record<string, Note>;
  people: Record<string, Person>;
  institutions: Record<string, Institution>;
  collections: Record<string, Collection>;
  docs: Record<string, Doc>;
  keywords: Record<string, Keyword>;
  edges: Edge[];
  /** The first and last note dates. */
  range: [string, string];
  /** How a link names a note (an id, slug, key or `doi:…`, folded), for `noteForUrl`. */
  aliases: Record<string, string>;
  linking: Pick<BuildOptions, 'noteHosts' | 'slugPrefixes'>;
  generatedAt: string;
}

/** Node ids carry their kind: `note:…`, `person:…`. */
export const nodeId = (kind: NodeKind, key: string) => `${kind}:${key}`;
export const kindOf = (id: string) => id.slice(0, id.indexOf(':')) as NodeKind;

/** Collections that aren't a place in the graph: drafts, and the "pinned" lists. */
const SKIPPED_COLLECTIONS = new Set(['staging', 'latest']);
/** A pinned list belongs to the collection it pins from. */
const pinnedTo = (slug: string) => slug.replace(/-pinned$/, '');
const PINNED_HOME: Record<string, string> = {
  london: 'devcells-node-london',
  chicago: 'devcells-node-chicago',
};

/** Authors that are a workshop, a group or an agent, not a person. */
const GROUP =
  /workshop|participants|working group|module|meeting|^igor$|^b\.next$|find ?what ?matters/i;

/** ORCIDs that are placeholders, not anyone's. */
const PLACEHOLDER_ORCID = /^0000-0000-0000-000\d$/;

const fold = (s: string) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

/** "Samuel J. Chen" and "Samuel Chen" are one person; so is "Maram Naji | Lucks Lab". */
function nameParts(name: string): { first: string; last: string } {
  const words = fold(name.split('|')[0]).replace(/[.,]/g, ' ').split(/\s+/).filter(Boolean);
  return { first: words[0] ?? '', last: words.length > 1 ? words[words.length - 1] : '' };
}

function editDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return d[a.length][b.length];
}

/** Same family name, and first names a typo apart ("Ocar" / "Oscar"). */
function sameName(a: string, b: string): boolean {
  if (fold(a).replace(/[^a-z0-9]/g, '') === fold(b).replace(/[^a-z0-9]/g, '')) return true;
  const x = nameParts(a);
  const y = nameParts(b);
  if (!x.last || x.last !== y.last) return x.first === y.first && x.last === y.last;
  return x.first === y.first || editDistance(x.first, y.first) <= 1;
}

const slugify = (s: string) =>
  fold(s)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Names institutions go by, folded, to the one name the graph uses. */
const INSTITUTION_ALIASES: Record<string, string> = {
  northwestern: 'Northwestern University',
  imperial: 'Imperial College London',
  'imperial college': 'Imperial College London',
  "king's college": "King's College London",
  ucl: 'University College London',
  'university college': 'University College London',
  'b.next': 'b.next',
  'find what matters': 'Find What Matters',
  findwhatmatters: 'Find What Matters',
};

/**
 * An affiliation's institution, and its lab: "Kamat Lab, Northwestern University,
 * Evanston, IL" is the Kamat Lab at Northwestern University. `null` for the
 * placeholders an empty affiliation leaves (`affiliations-curvenote-generated-uid-0`).
 */
export function parseAffiliation(name: string): { institution: string; labs: string[] } | null {
  if (!name || /generated-uid/.test(name)) return null;
  const parts = name
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  const labs = parts.filter((p) => /\blab$/i.test(p));
  const rest = parts.filter((p) => !/\blab$/i.test(p) && !/\b(department|dept)\b/i.test(p));
  const first = rest[0] ?? labs[0];
  if (!first) return null;
  const institution = INSTITUTION_ALIASES[fold(first)] ?? first;
  return { institution, labs };
}

/** Case and plural folded: "Cytosols" is "Cytosol", "Modules" is "Module". */
function keywordKey(keyword: string): string {
  const k = fold(keyword).replace(/\s+/g, ' ');
  return k.length > 4 && k.endsWith('s') && !k.endsWith('ss') ? k.slice(0, -1) : k;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/**
 * A docs page's title from its path: `/docs/modules/base-cytosol/spec/` → "Base cytosol
 * spec", `/guides/liposome-workshop/main/` → "Liposome workshop".
 */
export function docTitle(url: URL): string {
  const segs = url.pathname
    .split('/')
    .filter((p) => p && p !== 'main')
    .slice(1);
  const words = (s: string) => s.replace(/[-_]+/g, ' ');
  const name = segs.length > 1 ? segs[1] : (segs[0] ?? 'docs');
  return capitalize([name, ...segs.slice(2)].map(words).join(' '));
}

/** A collection named only by its slug: `ai-scientist` → "AI Scientist". */
const titleFromSlug = (slug: string) =>
  slug
    .split('-')
    .map((w) => (w === 'ai' ? 'AI' : capitalize(w)))
    .join(' ');

export interface BuildOptions {
  /** Hosts that serve this site's notes, e.g. `devnotes.nucleus.engineering`. */
  noteHosts: string[];
  /** Hosts whose pages are docs nodes. */
  docHosts: string[];
  /** Prefixes an article path may carry before the slug (`bnext-devnotes-`). */
  slugPrefixes?: string[];
}

export function buildDevnotesGraph(
  site: SiteInfo,
  raw: RawNote[],
  scmsCollections: ScmsCollection[],
  options: BuildOptions,
  now = new Date(),
): DevnotesGraph {
  const collectionInfo = new Map(scmsCollections.map((c) => [c.slug, c]));
  const homeOf = (slug: string) => {
    if (!slug.endsWith('-pinned')) return slug;
    const base = pinnedTo(slug);
    return PINNED_HOME[base] ?? base;
  };

  const kept = raw
    .filter((r) => r.work.collection && !SKIPPED_COLLECTIONS.has(r.work.collection.slug))
    .map((r) => ({ ...r, date: (r.work.date_published ?? r.work.date ?? '').slice(0, 10) }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.work.title.localeCompare(b.work.title));

  // Which note an article path, a DOI or an id means.
  const lookup = new Map<string, string>();
  const remember = (key: string | null | undefined, id: string) => {
    if (key) lookup.set(fold(key), id);
  };
  for (const { work } of kept) {
    const id = nodeId('note', work.id);
    remember(work.id, id);
    remember(work.slug, id);
    remember(work.key, id);
    if (work.doi) remember(`doi:${work.doi}`, id);
  }
  const aliases = Object.fromEntries(lookup);
  const resolveNote = (url: URL) => noteForUrl(url, aliases, options);

  // People: merged by name (typos included) and by ORCID where the family name agrees.
  interface AuthorRecord {
    name: string;
    orcid?: string;
    note: string;
    date: string;
    institutions: string[];
  }
  const records: AuthorRecord[] = [];
  const institutions = new Map<string, Institution>();
  const notes: Record<string, Note> = {};

  for (const r of kept) {
    const { work, project } = r;
    const id = nodeId('note', work.id);
    const affiliations = new Map((project?.affiliations ?? []).map((a) => [a.id, a]));
    const noteInstitutions = new Set<string>();
    const authorNames: { name: string; orcid?: string; institutions: string[] }[] = (
      project?.authors?.length
        ? project.authors
        : (work.authors ?? []).map((a) => ({ name: a.name, affiliations: [] }))
    ).flatMap((a) => {
      if (!a.name?.trim()) return [];
      const insts = new Set<string>();
      for (const affId of (a as { affiliations?: string[] }).affiliations ?? []) {
        const parsed = parseAffiliation(affiliations.get(affId)?.name ?? affId);
        if (!parsed) continue;
        const instId = nodeId('institution', slugify(parsed.institution));
        insts.add(instId);
        noteInstitutions.add(instId);
        const inst = institutions.get(instId) ?? {
          id: instId,
          name: parsed.institution,
          labs: [],
          people: [],
          notes: [],
          firstDate: r.date,
        };
        for (const lab of parsed.labs) if (!inst.labs.includes(lab)) inst.labs.push(lab);
        if (!inst.notes.includes(id)) inst.notes.push(id);
        institutions.set(instId, inst);
      }
      const orcid = (a as { orcid?: string }).orcid?.trim();
      return [
        {
          name: a.name.trim(),
          orcid: orcid && !PLACEHOLDER_ORCID.test(orcid) ? orcid : undefined,
          institutions: [...insts],
        },
      ];
    });
    for (const a of authorNames) records.push({ ...a, note: id, date: r.date });

    const collectionSlug = homeOf(work.collection!.slug);
    const thumb = project?.thumbnailOptimized ?? project?.thumbnail;
    notes[id] = {
      id,
      title: work.title,
      date: r.date,
      summary: r.summary,
      thumbnail:
        thumb && work.cdn && work.cdn_key ? `${work.cdn}${work.cdn_key}/public${thumb}` : undefined,
      url: work.links?.html ?? `${site.url}/articles/${work.slug ?? work.id}`,
      doi: work.doi || undefined,
      collection: nodeId('collection', collectionSlug),
      authors: [],
      institutions: [...noteInstitutions],
      keywords: [],
      linksTo: [],
      linkedFrom: [],
      docs: [],
    };
  }

  // An ORCID pasted under someone else's name belongs to the family name it's under
  // most; under any other, it's dropped.
  const orcidFamilies = new Map<string, Map<string, number>>();
  for (const rec of records) {
    if (!rec.orcid) continue;
    const families = orcidFamilies.get(rec.orcid) ?? new Map<string, number>();
    const last = nameParts(rec.name).last;
    families.set(last, (families.get(last) ?? 0) + 1);
    orcidFamilies.set(rec.orcid, families);
  }
  for (const rec of records) {
    if (!rec.orcid) continue;
    const owner = [...orcidFamilies.get(rec.orcid)!].sort((a, b) => b[1] - a[1])[0][0];
    if (nameParts(rec.name).last !== owner) rec.orcid = undefined;
  }

  // Group the records into people.
  const groups: AuthorRecord[][] = [];
  for (const rec of records) {
    const match = groups.find((g) =>
      g.some(
        (o) =>
          sameName(o.name, rec.name) ||
          (rec.orcid &&
            o.orcid === rec.orcid &&
            nameParts(o.name).last === nameParts(rec.name).last),
      ),
    );
    if (match) match.push(rec);
    else groups.push([rec]);
  }
  const people: Record<string, Person> = {};
  for (const g of groups) {
    // The name written most, then the longest ("Samuel J. Chen" over "Samuel Chen").
    const counts = new Map<string, number>();
    for (const r of g) {
      const n = r.name.split('|')[0].trim();
      counts.set(n, (counts.get(n) ?? 0) + 1);
    }
    const name = [...counts].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)[0][0];
    const orcid = g.find((r) => r.orcid)?.orcid;
    let id = nodeId('person', orcid ?? slugify(name));
    while (people[id]) id = `${id}-`;
    const sorted = [...g].sort((a, b) => a.date.localeCompare(b.date));
    const person: Person = {
      id,
      name,
      orcid,
      group: GROUP.test(name),
      notes: [...new Set(sorted.map((r) => r.note))],
      institutions: [...new Set(g.flatMap((r) => r.institutions))],
      firstNote: sorted[0].note,
      firstDate: sorted[0].date,
    };
    people[id] = person;
    for (const noteId of person.notes) notes[noteId].authors.push(id);
    for (const instId of person.institutions) {
      const inst = institutions.get(instId)!;
      if (!inst.people.includes(id)) inst.people.push(id);
    }
  }

  // Collections, keywords, links and docs.
  const collections: Record<string, Collection> = {};
  const keywords: Record<string, Keyword> = {};
  const docs: Record<string, Doc> = {};
  const edges: Edge[] = [];
  const later = (a: string, b: string) => (a > b ? a : b);

  for (const r of kept) {
    const id = nodeId('note', r.work.id);
    const note = notes[id];

    const slug = note.collection.slice('collection:'.length);
    const info = collectionInfo.get(slug) ?? collectionInfo.get(r.work.collection!.slug);
    collections[note.collection] ??= {
      id: note.collection,
      slug,
      title: (() => {
        const t = info?.content?.title ?? r.work.collection?.content?.title;
        return !t || t === slug ? titleFromSlug(slug) : t;
      })(),
      description: info?.content?.description,
      notes: [],
    };
    collections[note.collection].notes.push(id);

    for (const kw of r.project?.keywords ?? []) {
      const key = keywordKey(kw);
      if (!key) continue;
      const kwId = nodeId('keyword', slugify(key));
      keywords[kwId] ??= { id: kwId, label: kw.trim(), notes: [] };
      if (!keywords[kwId].notes.includes(id)) keywords[kwId].notes.push(id);
      if (!note.keywords.includes(kwId)) note.keywords.push(kwId);
    }

    for (const href of r.links) {
      let url: URL;
      try {
        url = new URL(href);
      } catch {
        continue;
      }
      const target = resolveNote(url);
      if (target && target !== id) {
        if (!note.linksTo.includes(target)) note.linksTo.push(target);
        continue;
      }
      if (options.docHosts.includes(url.hostname)) {
        url.hash = '';
        url.search = '';
        const path = url.pathname.replace(/\.$/, '').replace(/\/?$/, '/');
        const docUrl = `${url.origin}${path}`;
        const docId = nodeId('doc', slugify(path) || 'home');
        docs[docId] ??= { id: docId, url: docUrl, title: docTitle(new URL(docUrl)), notes: [] };
        if (!docs[docId].notes.includes(id)) docs[docId].notes.push(id);
        if (!note.docs.includes(docId)) note.docs.push(docId);
      }
    }
  }

  for (const note of Object.values(notes)) {
    for (const target of note.linksTo) notes[target].linkedFrom.push(note.id);
  }

  // Edges, each dated by when both ends exist.
  for (const note of Object.values(notes)) {
    edges.push({ source: note.id, target: note.collection, kind: 'collection', date: note.date });
    for (const p of note.authors)
      edges.push({ source: p, target: note.id, kind: 'author', date: note.date });
    for (const k of note.keywords)
      edges.push({ source: note.id, target: k, kind: 'keyword', date: note.date });
    for (const d of note.docs)
      edges.push({ source: note.id, target: d, kind: 'doc', date: note.date });
    for (const t of note.linksTo) {
      edges.push({
        source: note.id,
        target: t,
        kind: 'link',
        date: later(note.date, notes[t].date),
      });
    }
  }
  for (const person of Object.values(people)) {
    for (const inst of person.institutions) {
      edges.push({ source: person.id, target: inst, kind: 'affiliation', date: person.firstDate });
    }
  }

  const dates = Object.values(notes)
    .map((n) => n.date)
    .filter(Boolean)
    .sort();
  return {
    site,
    notes,
    people,
    institutions: Object.fromEntries(institutions),
    collections,
    docs,
    keywords,
    edges,
    range: [dates[0] ?? '', dates[dates.length - 1] ?? ''],
    aliases,
    linking: { noteHosts: options.noteHosts, slugPrefixes: options.slugPrefixes },
    generatedAt: now.toISOString(),
  };
}

/**
 * The note a URL points to: `https://<note host>/articles/<id, slug or key>` (with or
 * without a site prefix such as `bnext-devnotes-`), or `https://doi.org/<its DOI>`.
 */
export function noteForUrl(
  href: string | URL,
  aliases: Record<string, string>,
  options: Pick<BuildOptions, 'noteHosts' | 'slugPrefixes'>,
): string | undefined {
  let url: URL;
  try {
    url = typeof href === 'string' ? new URL(href) : href;
  } catch {
    return undefined;
  }
  if (url.hostname === 'doi.org')
    return aliases[`doi:${fold(decodeURIComponent(url.pathname.slice(1)))}`];
  if (!options.noteHosts.includes(url.hostname)) return undefined;
  const m = url.pathname.match(/^\/articles\/([^/]+)/);
  if (!m) return undefined;
  const key = fold(decodeURIComponent(m[1]));
  if (aliases[key]) return aliases[key];
  for (const prefix of (options.slugPrefixes ?? []).map(fold)) {
    if (key.startsWith(prefix) && aliases[key.slice(prefix.length)]) {
      return aliases[key.slice(prefix.length)];
    }
  }
  return undefined;
}

/** Plain text of an mdast node. */
export function mdastText(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const n = node as { value?: unknown; children?: unknown[] };
  if (typeof n.value === 'string') return n.value;
  return (n.children ?? []).map(mdastText).join('');
}

/** Every `url` in an mdast tree. */
export function mdastUrls(node: unknown, out: string[] = []): string[] {
  if (Array.isArray(node)) {
    for (const child of node) mdastUrls(child, out);
  } else if (node && typeof node === 'object') {
    const n = node as Record<string, unknown>;
    if (typeof n.url === 'string' && /^https?:/.test(n.url)) out.push(n.url);
    for (const value of Object.values(n))
      if (value && typeof value === 'object') mdastUrls(value, out);
  }
  return out;
}

/** The abstract's text, or the first paragraph's, cut to about `max` characters. */
export function mdastSummary(mdast: unknown, max = 320): string | undefined {
  let abstract: unknown;
  let paragraph: unknown;
  const walk = (node: unknown) => {
    if (abstract || !node || typeof node !== 'object') return;
    const n = node as { type?: string; data?: { part?: string }; children?: unknown[] };
    if (n.type === 'block' && n.data?.part === 'abstract') abstract = node;
    if (!paragraph && n.type === 'paragraph' && mdastText(node).trim().length > 60)
      paragraph = node;
    n.children?.forEach(walk);
  };
  walk(mdast);
  const text = mdastText(abstract ?? paragraph)
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return undefined;
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, '')}…` : text;
}

/** Is this person new? Their first note is within `days` (about a season) of `today`. */
export function isNewArrival(person: Person, today: string, days = 90): boolean {
  if (person.group || !person.firstDate) return false;
  const ms = Date.parse(today) - Date.parse(person.firstDate);
  return ms >= 0 && ms <= days * 86_400_000;
}
