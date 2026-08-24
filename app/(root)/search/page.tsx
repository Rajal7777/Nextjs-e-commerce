import ProductCart from "@/components/shared/product/product-cart";
import Link from "next/link";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/product-actions";
import { getWishlistIds } from "@/lib/actions/wishlist/wish.action";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown, ChevronRight, Star } from "lucide-react";

//Dynamic metadata
export async function generateMetadata(props: {
  searchParams: {
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
  };
}) {
  const {
    q = "",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

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

const Search = async (props: {
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
  } = await props.searchParams;

  //filter url
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
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const parsedPage = Number(page);
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: currentPage,
  });

  //get wishlist ids for the current user
  const wishlistIds = await getWishlistIds();

  const wishListSet = new Set(wishlistIds);

  const productsWithWishlist = products.data.map((product) => ({
    ...product,
    isFavorite: wishListSet.has(product.id),
  }));

  const categories = await getAllCategories();

  const categoryItems = [
    { name: "All", value: "all" },
    ...categories.map((item) => ({
      name: item.category,
      value: item.category,
    })),
  ];

  const priceItems = [
    { name: "Any Price", value: "all" },
    { name: "Yen 0 - 1000", value: "0-1000" },
    { name: "Yen 1000 - 3000", value: "1000-3000" },
    { name: "Yen 3000 - 5000", value: "3000-5000" },
    { name: "Yen 5000+", value: "5000+" },
  ];

  const sortItems = [
    { label: "Newest", value: "newest" },
    { label: "Lowest", value: "lowest" },
    { label: "Highest", value: "highest" },
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
    <div className="grid gap-5 lg:grid-cols-[240px_1fr] mt-6">
      <aside>
        <div className="rounded-xl  bg-card p-3 lg:sticky lg:top-20">
          <section>
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md py-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                <span>Search by category</span>
              </summary>
              <div className="mt-2 max-h-[45vh] space-y-1 overflow-y-auto pr-1">
                {categoryItems.map((item) => {
                  const isActive = category === item.value;
                  return (
                    <Link
                      key={`category-${item.value}`}
                      href={getFilterUrl({ c: item.value })}
                      className={`flex items-center justify-between rounded-md px-2.5 py-2 text-sm ${isActive
                        ? "bg-muted font-semibold text-foreground"
                        : "text-foreground/90 hover:bg-muted"
                        }`}
                    >
                      <span className="truncate">{item.name}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </details>
          </section>

          <section className="mt-5 border-t pt-4">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md py-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                <span>Search by price</span>
              </summary>
              <div className="mt-2 space-y-1">
                {priceItems.map((item) => {
                  const isActive = price === item.value;
                  return (
                    <Link
                      key={`price-${item.value}`}
                      href={getFilterUrl({ p: item.value })}
                      className={`flex items-center justify-between rounded-md px-2.5 py-2 text-sm ${isActive
                        ? "bg-muted font-semibold text-foreground"
                        : "text-foreground/90 hover:bg-muted"
                        }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </details>
          </section>

          <section className="mt-5 border-t pt-4">
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-md py-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                <span>Search by rating</span>
              </summary>
              <div className="mt-2 space-y-1">
                {ratingItems.map((item) => {
                  const isActive = rating === item.value;
                  return (
                    <Link
                      key={`rating-${item.value}`}
                      href={getFilterUrl({ r: item.value })}
                      className={`flex items-center justify-between rounded-md px-2.5 py-2 text-sm ${isActive
                        ? "bg-muted font-semibold text-foreground"
                        : "text-foreground/90 hover:bg-muted"
                        }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {item.value !== "all" ? <Star className="h-3.5 w-3.5" /> : null}
                        {item.name}
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
            </details>
          </section>
        </div>
      </aside>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {hasActiveFilter ? "Filtered results" : "Showing all products"}
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">Sort By:</span>
            <div className="relative">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center gap-1 rounded-md border bg-card px-3 py-2">
                  {currentSortLabel}
                  <ChevronDown className="h-4 w-4" />
                </summary>
                <div className="absolute right-0 z-20 mt-2 min-w-40 rounded-lg border bg-card p-1 shadow-md">
                  {sortItems.map((item) => (
                    <Link
                      key={item.value}
                      href={getFilterUrl({ s: item.value })}
                      className={`block rounded-md px-3 py-2 text-sm ${sort === item.value
                          ? "bg-muted font-semibold"
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

        {(q !== "all" && q !== "") || (category !== "all" && category !== "") ? (
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {q !== "all" && q !== "" && (
              <span>
                Search: <span className="font-semibold text-foreground">{q}</span>
              </span>
            )}
            {category !== "all" && category !== "" && (
              <span>
                Category: <span className="font-semibold text-foreground">{category}</span>
              </span>
            )}
            {hasActiveFilter ? (
              <Button asChild variant="secondary" className="ml-1 text-sm text-red-500">
                <Link href="/search">
                  Clear Filters
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 xl:gap-4">
          {productsWithWishlist.length === 0 && <div>No products found</div>}
          {productsWithWishlist.map((product) => (
            <ProductCart key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
