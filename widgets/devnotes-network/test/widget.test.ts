import { describe, expect, test } from 'bun:test';
import { buildDevnotesGraph, type RawNote } from '../src/graph';
import { findPeople, graphView, neighbours } from '../src/widget';

const SITE = { name: 'bnext-devnotes', title: 'Dev Notes', url: 'https://devnotes.example.org' };
const OPTIONS = { noteHosts: ['devnotes.example.org'], docHosts: ['docs.example.org'] };

function note(id: string, date: string, authors: string[], links: string[] = []): RawNote {
  return {
    work: {
      id,
      slug: `slug-${id}`,
      title: `Note ${id}`,
      date_published: `${date}T00:00:00Z`,
      collection: { slug: 'core' },
    },
    project: { authors: authors.map((name) => ({ name })) },
    links,
  };
}

const graph = buildDevnotesGraph(
  SITE,
  [
    note('a', '2025-01-22', ['Sharon Newman', 'Samuel Chen']),
    note('b', '2026-09-01', ['Ada Lovelace'], ['https://devnotes.example.org/articles/slug-a']),
    note('c', '2026-09-02', ['DevCells Kickoff Workshop', 'Samuel J. Chen']),
  ],
  [],
  OPTIONS,
);

describe('graphView', () => {
  const view = graphView(graph, '2026-10-11', 90);
  const byName = (name: string) => view.nodes.find((n) => n.label.startsWith(name))!;

  test('people only, not workshops or groups', () => {
    expect(view.nodes.map((n) => n.label).sort()).toEqual([
      'Ada Lovelace',
      'Samuel J. Chen',
      'Sharon Newman',
    ]);
  });

  test('co-authors are joined; a link between notes is a lighter "builds on" edge', () => {
    const sharon = byName('Sharon').id;
    const samuel = byName('Samuel').id;
    const ada = byName('Ada').id;
    const kinds = Object.fromEntries(
      view.edges.map((e) => [[e.source, e.target].sort().join('|'), `${e.kind}:${e.weight}`]),
    );
    expect(kinds).toEqual({
      [[sharon, samuel].sort().join('|')]: 'coauthor:1',
      [[ada, sharon].sort().join('|')]: 'builds:1',
      [[ada, samuel].sort().join('|')]: 'builds:1',
    });
  });

  test('new contributors, initials, size', () => {
    expect(byName('Ada').isNew).toBe(true);
    expect(byName('Ada').initials).toBe('AL');
    expect(byName('Sharon').isNew).toBe(false);
    // Samuel wrote two notes, so his circle is bigger.
    expect(byName('Samuel').count).toBe(2);
    expect(byName('Samuel').r).toBeGreaterThan(byName('Sharon').r);
  });

  test('neighbours', () => {
    const samuel = byName('Samuel').id;
    expect(neighbours(view.edges, samuel)).toEqual(
      new Set([samuel, byName('Sharon').id, byName('Ada').id]),
    );
  });
});

describe('findPeople', () => {
  test('name starts first, then word starts; groups left out', () => {
    expect(findPeople(graph, 'sa').map((p) => p.name)).toEqual(['Samuel J. Chen']);
    expect(findPeople(graph, 'love').map((p) => p.name)).toEqual(['Ada Lovelace']);
    expect(findPeople(graph, 'workshop')).toEqual([]);
    expect(findPeople(graph, '  ')).toEqual([]);
  });
});
