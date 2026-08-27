import ProductCart from "@/components/shared/product/product-cart";
import Link from "next/link";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product-actions";
import { getWishlistIds } from "@/lib/actions/wishlist/wish.action";
import { Button } from "@/components/ui/button";
import { ChevronDown, Filter, X } from "lucide-react";
import Pagination from "@/components/shared/pagination";
import { Suspense } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import FilterControls from "./filter-bar";

// Dynamic metadata
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
  }>;
}) {
  const {
    q = "",
    category = "all",
    price = "all",
    rating = "all",
  } = await searchParams;

  const isQuery = q && q !== "all" && q.trim() !== "";
  const isCategory = category && category !== "all" && category.trim() !== "";
  const isPrice = price && price !== "all" && price.trim() !== "";
  const isRating = rating && rating !== "all" && rating.trim() !== "";

  if (isQuery || isCategory || isPrice || isRating) {
    const titleParts = [];
    if (isQuery) titleParts.push(`Search results for "${q}"`);
    if (isCategory) titleParts.push(`Category: ${category}`);
    if (isPrice) titleParts.push(`Price: ${price}`);
    if (isRating) titleParts.push(`Rating: ${rating} stars & up`);
    return {
      title: titleParts.join(" | "),
    };
  }
  return {
    title: "Search",
  };
}

const Search = async ({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = "",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await searchParams;

  // Filter URL builder
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };

    if (c !== undefined) {
      params.category = c;
      params.q = ""; // Clears the search query when filtering by category
      params.page = "1";
    }

    if (p) {
      params.price = p;
      params.page = "1";
    }

    if (r) {
      params.rating = r;
      params.page = "1";
    }
    if (pg) params.page = pg;
    if (s) params.sort = s;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all") {
        searchParams.set(key, value);
      }
    });

    return `/search?${searchParams.toString()}`;
  };

  const parsedPage = Number(page);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const [products, wishlistIds, categories] = await Promise.all([
    getAllProducts({
      query: q,
      category,
      price,
      rating,
      sort,
      page: currentPage,
    }),
    getWishlistIds(),
    getAllCategories(),
  ]);

  const wishListSet = new Set(wishlistIds);

  const productsWithWishlist = products.data.map((product) => ({
    ...product,
    isFavorite: wishListSet.has(product.id),
  }));

  const categoryItems = [
    { name: "All Categories", value: "all" },
    ...categories.map((item) => ({
      name: item.category,
      value: item.category,
    })),
  ];

  const priceItems = [
    { name: "Any Price", value: "all" },
    { name: "¥0 - ¥1000", value: "0-1000" },
    { name: "¥1000 - ¥3000", value: "1000-3000" },
    { name: "¥3000 - ¥5000", value: "3000-5000" },
    { name: "¥5000+", value: "5000" },
  ];

  const sortItems = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "lowest" },
    { label: "Price: High to Low", value: "highest" },
    { label: "Top Rated", value: "rating" },
  ];

  const currentSortLabel =
    sortItems.find((item) => item.value === sort)?.label ?? "Newest";

  const ratingItems = [
    { name: "All Ratings", value: "all" },
    { name: "4 stars & up", value: "4" },
    { name: "3 stars & up", value: "3" },
    { name: "2 stars & up", value: "2" },
    { name: "1 star & up", value: "1" },
  ];

  const hasActiveFilter =
    (q !== "all" && q !== "") ||
    (category !== "all" && category !== "") ||
    (price !== "all" && price !== "") ||
    (rating !== "all" && rating !== "");



  return (
    <div className="mt-4 grid gap-6 lg:grid-cols-[240px_1fr] lg:mt-6">
      {/* Desktop Sidebar Filters */}
      <aside className="hidden lg:block">
        <div className="sticky top-20 rounded-xl p-4">
          <div className="mb-4 flex items-center justify-between border-b pb-3">
            <h2 className="font-semibold text-foreground">Filters</h2>
            {hasActiveFilter && (
              <Link
                href="/search"
                className="text-xs text-destructive hover:underline"
              >
                Reset All
              </Link>
            )}
          </div>
          <FilterControls
            getFilterUrl={getFilterUrl}
            category={category}
            price={price}
            rating={rating}
            categoryItems={categoryItems}
            priceItems={priceItems}
            ratingItems={ratingItems}
          />
        </div>
      </aside>

      <div className="space-y-4">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between gap-3 border-b pb-3">
          {/* Mobile Filter Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {hasActiveFilter && (
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-75 sm:w-87 p-6 overflow-y-auto "
              >
                <SheetHeader className="border-b pb-4 text-left">
                  <SheetTitle className="flex items-center justify-between">
                    <span>Filter Products</span>
                    {hasActiveFilter && (
                      <SheetClose asChild>
                        <Link
                          href="/search"
                          className="text-xs font-normal text-destructive hover:underline"
                        >
                          Clear All
                        </Link>
                      </SheetClose>
                    )}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <FilterControls
                    getFilterUrl={getFilterUrl}
                    category={category}
                    price={price}
                    rating={rating}
                    categoryItems={categoryItems}
                    priceItems={priceItems}
                    ratingItems={ratingItems}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden text-sm text-muted-foreground sm:block">
            {hasActiveFilter ? "Filtered results" : "Showing all products"}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-sm ml-auto sm:ml-0">
            <span className="hidden text-muted-foreground sm:inline">
              Sort by:
            </span>
            <div className="relative">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium shadow-sm transition-colors hover:bg-muted sm:text-sm">
                  <span>{currentSortLabel}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="absolute right-0 z-30 mt-1.5 min-w-40 rounded-lg border bg-popover p-1 shadow-lg ring-1 ring-black/5">
                  {sortItems.map((item) => (
                    <Link
                      key={item.value}
                      href={getFilterUrl({ s: item.value })}
                      className={`block rounded-md px-3 py-2 text-xs transition-colors sm:text-sm ${
                        sort === item.value
                          ? "bg-accent font-semibold text-accent-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilter && (
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            {q && q !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium text-foreground">
                Search: {q}
              </span>
            )}
            {category && category !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium text-foreground">
                Category: {category}
              </span>
            )}
            {price && price !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium text-foreground">
                Price: {price}
              </span>
            )}
            {rating && rating !== "all" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium text-foreground">
                Rating: {rating}+★
              </span>
            )}
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Link href="/search">
                Clear Filters
                <X className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        )}

        {/* Mobile Product Card Grid Polish */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {productsWithWishlist.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No products match your criteria.
            </div>
          ) : (
            <Suspense
              fallback={
                <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                  Loading products...
                </p>
              }
            >
              {productsWithWishlist.map((product) => (
                <div
                  key={product.id}
                  className="h-full transition-transform active:scale-[0.98]"
                >
                  <ProductCart product={product} />
                </div>
              ))}
            </Suspense>
          )}
        </div>

        {/* Mobile-Friendly Pagination Container */}
        {productsWithWishlist.length > 0 && products.totalPages > 1 && (
          <div className="mt-8 flex justify-center border-t pt-6 overflow-x-auto pb-2">
            <Pagination
              page={currentPage}
              totalPages={products.totalPages}
              urlParamName="page"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
