export type FilterState = {
  q: string;
  category: string;
  price: string;
  rating: string;
  sort: string;
  page: string;
};

export type FilterOverride = {
  c?: string;
  s?: string;
  p?: string;
  r?: string;
  pg?: string;
};

export function buildFilterUrl(state: FilterState, override: FilterOverride) {
  const { q, category, price, rating, sort, page } = state;
  const { c, s, p, r, pg } = override;

  const params = {
    q: c !== undefined ? "" : q, // Category badalda Search Query reset
    category: c ?? category,
    price: p ?? price,
    rating: r ?? rating,
    sort: s ?? sort,
    page: pg ?? (c !== undefined || p || r ? "1" : page),
  };

  const searchParamsObj = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value && value !== "all") {
      searchParamsObj.set(key, value);
    }
  });

  return `/search?${searchParamsObj.toString()}`;
}
