export function getTotalPages(totalCount: number, limit: number) {
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 1;

  if (!Number.isFinite(totalCount) || totalCount <= 0) {
    return 0;
  }

  return Math.ceil(totalCount / safeLimit);
}
