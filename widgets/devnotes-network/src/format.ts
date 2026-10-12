/** `2026-09-10` → "Sep 10, 2026". */
export function formatDate(date: string | undefined): string {
  if (!date) return '';
  const d = new Date(`${date.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Initials for an avatar: "Sharon Newman" → "SN". */
export function initials(name: string): string {
  const words = name.split(/[\s|]+/).filter((w) => /^[\p{L}]/u.test(w));
  return (
    (words[0]?.[0] ?? '') + (words.length > 1 ? words[words.length - 1][0] : '')
  ).toUpperCase();
}
