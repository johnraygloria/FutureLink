export type SortDirection = 'asc' | 'desc';
export type SortValueType = 'string' | 'number' | 'date';
export type SortState = { key: string; direction: SortDirection } | null;

export type SortColumnConfig<T> = {
  accessor: (row: T) => unknown;
  type?: SortValueType;
};

export type SortColumnMap<T> = Record<string, SortColumnConfig<T>>;

// Date columns hold free-form VARCHARs ("1/2/2003", ISO, "19-Mar-25", "-", ...),
// so parsing must be defensive: anything unparseable sorts with the empty values.
const D_MMM_YY = /^(\d{1,2})-([A-Za-z]{3})-(\d{2})$/;

export const parseSortDate = (value: unknown): number | null => {
  if (value == null) return null;
  const raw = String(value).trim();
  if (raw === '' || raw === '-' || raw === '?') return null;
  // "19-Mar-25" parses in Chrome but not Firefox; normalize it first.
  const dMmmYy = raw.match(D_MMM_YY);
  const candidate = dMmmYy ? `${dMmmYy[1]} ${dMmmYy[2]} 20${dMmmYy[3]}` : raw;
  const time = new Date(candidate).getTime();
  return Number.isNaN(time) ? null : time;
};

const normalizeValue = (value: unknown, type: SortValueType): string | number | null => {
  if (type === 'date') return parseSortDate(value);
  if (value == null) return null;
  const str = String(value).trim();
  if (str === '') return null;
  if (type === 'number') {
    const num = Number(str.replace(/,/g, ''));
    return Number.isNaN(num) ? null : num;
  }
  return str;
};

const compareNormalized = (a: string | number, b: string | number): number => {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  // Natural order: "9" < "10", alphanumeric IDs group sensibly, case/accent-insensitive.
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
};

export function sortRows<T>(
  rows: readonly T[],
  accessor: (row: T) => unknown,
  type: SortValueType,
  direction: SortDirection,
): T[] {
  const decorated = rows.map((row, index) => ({ row, index, value: normalizeValue(accessor(row), type) }));
  const present = decorated.filter((d) => d.value !== null);
  const missing = decorated.filter((d) => d.value === null);
  const sign = direction === 'desc' ? -1 : 1;
  present.sort((a, b) => {
    const cmp = compareNormalized(a.value as string | number, b.value as string | number);
    // Equal values keep their incoming (backend) order in both directions.
    return cmp !== 0 ? sign * cmp : a.index - b.index;
  });
  // Empty/unparseable values stay at the bottom regardless of direction.
  return [...present, ...missing].map((d) => d.row);
}
