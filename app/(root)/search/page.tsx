import ProductCart from "@/components/shared/product/product-cart";
import { getAllProducts } from "@/lib/actions/product-actions";

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

    const parsedPage = Number(page);
    const currentPage = Number.isFinite(parsedPage) && parsedPage > 0
        ? Math.floor(parsedPage)
        : 1;
   
    const products = await getAllProducts({
        query: q,
        category,
        price,
        rating,
        sort,
        page: currentPage,
    });
    return (
        <div className="grid md:grid-cols-5 md:gap-5 border">
            {/* FILTERS */}
            <div>filters</div>
           <div className="md:col-span-4 space-y-4">
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