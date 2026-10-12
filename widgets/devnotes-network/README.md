# Who writes DevNotes

The co-authorship network on the landing page: a circle for everyone who has written a
DevNote (their initials, sized by how many notes they've written, coloured by institution),
a line between people who wrote a note together, and a dashed one where one's note links to
the other's. Find yourself, pick a lab to see its people, and look out for new contributors
in green.

It's an [anywidget](https://anywidget.dev): `index.md` loads the built
`widgets/devnotes-network.mjs`.

```markdown
:::{anywidget} widgets/devnotes-network.mjs
:class: col-page-right
{ "site": "bnext-devnotes", "height": 640 }
:::
```

## Source

- `src/widget.ts`: fetching, the network view and the anywidget `render`.
- `src/graph.ts`: turning the notes into people, institutions and links (authors written
  three ways, one ORCID under two names, many spellings of one institution).
- `src/format.ts`: dates and initials.
- `build.ts`: bundles it all into `../devnotes-network.mjs`.

The notes are fetched in the browser from Curvenote, so the page is always up to date. The
build also fetches them and caches them into the bundle, so the graph draws as soon as the
page opens and the live notes replace it a moment later. The deploy workflow runs the
build before the site builds, so the cache is as fresh as the last deploy (run the
workflow by hand to refresh it). If the notes can't be fetched, the bundle is built
without them and the page loads them itself.

## Working on it

```bash
cd widgets/devnotes-network
bun install
bun run build        # writes ../devnotes-network.mjs (gitignored)
curvenote start      # from the repo root, to see it on the landing page
```

`bun test`, `bun run typecheck`, `bun run lint` and `bun run lint:format` run on pull
requests that touch this folder.

## Options

Set in the directive's JSON body.

| Option                     | Default                                                    |
| -------------------------- | ---------------------------------------------------------- |
| `site`                     | `bnext-devnotes`                                           |
| `api`                      | `https://scms.curvenote.com/v1/`                           |
| `height`                   | `640` (pixels)                                             |
| `refresh`                  | `60` seconds between refreshes; `0` for never              |
| `newDays` / `new_days`     | `90`: a person is new for this long after their first note |
| `noteHosts` / `note_hosts` | `devnotes.nucleus.engineering`, `devnotes.bnext.bio`       |
| `docHosts` / `doc_hosts`   | `docs.nucleus.engineering`                                 |
| `highlight`                | A person to find on load, by name                          |
| `theme`                    | `auto` follows the page's dark mode; or `light` / `dark`   |

"Find yourself" remembers who you picked in this browser.
