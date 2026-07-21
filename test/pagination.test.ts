import { getTotalPages } from "../lib/pagination";

describe("getTotalPages", () => {
  it("returns 0 when there are no products", () => {
    expect(getTotalPages(0, 2)).toBe(0);
  });

  it("returns 1 when the product count fits in one page", () => {
    expect(getTotalPages(2, 2)).toBe(1);
  });

  it("returns 2 when the product count needs a second page", () => {
    expect(getTotalPages(3, 2)).toBe(2);
  });
});
