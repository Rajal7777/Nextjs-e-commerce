import ProductCart from "@/components/shared/product/product-cart";
import Link from "next/link";
import {
    getAllCategories,
    getAllProducts,
} from "@/lib/actions/product-actions";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
        { name: "$0 to $50", value: "0-50" },
        { name: "$51 to $100", value: "51-100" },
        { name: "$101 to $200", value: "101-200" },
        { name: "$200 and up", value: "200+" },
    ];

    const ratingItems = [
        { name: "All Ratings", value: "all" },
        { name: "4 stars & up", value: "4" },
        { name: "3 stars & up", value: "3" },
        { name: "2 stars & up", value: "2" },
        { name: "1 star & up", value: "1" },
    ];

    const sortItems = ['Newest', 'Lowest', 'Highest', 'Top Rated'];

    const linkBaseClass =
        "block rounded-md border px-3 py-2 text-sm transition-colors duration-200";
    const activeClass = "border-primary bg-primary text-primary-foreground";
    const idleClass = "border-border hover:bg-muted";

    return (
        <div className="grid gap-5 md:grid-cols-5">
            {/* FILTERS */}
            <div className="filter-links md:col-span-1">
                <aside className="sticky top-20 rounded-xl border bg-card p-4 shadow-sm">
                    <h2 className="h3-bold mb-4">Filter Products</h2>

                    <div className="space-y-5">
                        <section>
                            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                                Search by category
                            </h3>
                            <div className="space-y-2">
                                {categoryItems.map((item) => {
                                    const isActive = category === item.value;
                                    return (
                                        <Link
                                            key={`category-${item.value}`}
                                            href={getFilterUrl({ c: item.value })}
                                            className={`${linkBaseClass} ${isActive ? activeClass : idleClass}`}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>

                        <section>
                            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                                Search by price
                            </h3>
                            <div className="space-y-2">
                                {priceItems.map((item) => {
                                    const isActive = price === item.value;
                                    return (
                                        <Link
                                            key={`price-${item.value}`}
                                            href={getFilterUrl({ p: item.value })}
                                            className={`${linkBaseClass} ${isActive ? activeClass : idleClass}`}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>

                        <section>
                            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                                Search by customer review
                            </h3>
                            <div className="space-y-2">
                                {ratingItems.map((item) => {
                                    const isActive = rating === item.value;
                                    return (
                                        <Link
                                            key={`rating-${item.value}`}
                                            href={getFilterUrl({ r: item.value })}
                                            className={`${linkBaseClass} ${isActive ? activeClass : idleClass}`}
                                        >
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                </aside>
            </div>
            <div className="md:col-span-4 space-y-4">
                <div className="flex-between flex-col md:flex-row my-4">
                    <div className="flex items-center">
                        {q !== "all" && q !== "" && (
                            <p>
                                Search results for:
                                <span className="ml-2 font-semibold">{q}</span>
                            </p>
                        )}

                        {category !== "all" && category !== "" && (
                            <p>
                                Search results by category:
                                <span className="ml-2 font-semibold">{category}</span>
                            </p>
                        )}

                        {price !== "all" && price !== "" && (
                            <p>
                                Search results by price:
                                <span className="ml-2 font-semibold">{price}</span>
                            </p>
                        )}

                        {rating !== "all" && rating !== "" && (
                            <p>
                                Search results by rating:
                                <span className="ml-2 font-semibold">{rating}</span>
                            </p>
                        )}

                        {(q !== "all" && q !== "") ||
                            (category !== "all" && category !== "") ||
                            (price !== "all" && price !== "") ||
                            (rating !== "all" && rating !== "") ? (
                            <Button asChild variant="secondary" className="ml-4 text-sm text-red-400">
                                <Link href="/search">Clear Filters
                                    <ArrowRight />
                                </Link>
                            </Button>
                        ) : null}
                    </div>

                    <div>
                        {/* Sorting */}
                        Sort by:{" "}
                     {sortItems.map((item) => (
                        <Link
                        key={item}
                        href={getFilterUrl({ s: item })}
                        className={`mx-2 ${sort === item ? 'font-bold' : ''}`}
                        >
                        {item}
                        </Link>
                     ))}
                    </div>

                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {products.data.length === 0 && <div>No products found</div>}
                    {products.data.map((product) => (
                        <ProductCart key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Search;
