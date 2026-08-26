import Link from "next/link";
import { ChevronDown, ChevronRight, Star } from "lucide-react";

type FilterItem = {
  name: string;
  value: string;
};

type GetFilterUrl = (filters: {
  c?: string;
  p?: string;
  r?: string;
}) => string;

type FilterControlsProps = {
  getFilterUrl: GetFilterUrl;
  category: string;
  price: string;
  rating: string;
  categoryItems: FilterItem[];
  priceItems: FilterItem[];
  ratingItems: FilterItem[];
};

export default function FilterControls({
  getFilterUrl,
  category,
  price,
  rating,
  categoryItems,
  priceItems,
  ratingItems,
}: FilterControlsProps) {
  return (
    <div className="space-y-4">
      {/* Category */}
      <section>
        <details className="group" open>
          <summary className="flex cursor-pointer list-none items-center justify-between py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>Category</span>

            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>

          <div className="mt-2 max-h-52 space-y-1 overflow-y-auto pr-1">
            {categoryItems.map((item) => {
              const isActive = category === item.value;

              return (
                <Link
                  key={`category-${item.value}`}
                  href={getFilterUrl({ c: item.value })}
                  className={`flex items-center justify-between rounded-md px-2.5 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  <span className="truncate">{item.name}</span>

                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}
          </div>
        </details>
      </section>

      {/* Price */}
      <section className="border-t pt-4">
        <details className="group" open>
          <summary className="flex cursor-pointer list-none items-center justify-between py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>Price Range</span>

            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>

          <div className="mt-2 space-y-1">
            {priceItems.map((item) => {
              const isActive = price === item.value;

              return (
                <Link
                  key={`price-${item.value}`}
                  href={getFilterUrl({ p: item.value })}
                  className={`flex items-center justify-between rounded-md px-2.5 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  <span>{item.name}</span>

                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}
          </div>
        </details>
      </section>

      {/* Rating */}
      <section className="border-t pt-4">
        <details className="group" open>
          <summary className="flex cursor-pointer list-none items-center justify-between py-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <span>Rating</span>

            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
          </summary>

          <div className="mt-2 space-y-1">
            {ratingItems.map((item) => {
              const isActive = rating === item.value;

              return (
                <Link
                  key={`rating-${item.value}`}
                  href={getFilterUrl({ r: item.value })}
                  className={`flex items-center justify-between rounded-md px-2.5 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground/80 hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.value !== "all" && (
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    )}

                    {item.name}
                  </span>

                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              );
            })}
          </div>
        </details>
      </section>
    </div>
  );
}