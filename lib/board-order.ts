export function moveWithin<T>(items: T[], from: number, to: number): T[] {
  const clone = [...items];
  const [item] = clone.splice(from, 1);
  clone.splice(to, 0, item);
  return clone;
}

export function reindexByOrder<T extends { id: string }>(items: T[]) {
  return items.map((item, idx) => ({ id: item.id, order: idx }));
}
