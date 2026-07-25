"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";

const AdminSearch = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const routes = [
        "/admin/orders",
        "/admin/users",
        "/admin/products",
    ];

    const formActionUrl =
        routes.find(route => pathname.includes(route)) ?? "/admin/products";

        //only keep empty sting if query param is null or undefined, otherwise use the query param value    
    const queryValue = searchParams.get("query") ?? "";

    return (
        <form action={formActionUrl} method="GET">
            <Input
                type="text"
                placeholder="Search..."
                name="query"
                defaultValue={queryValue}
                className="w-20 md:w-70  lg:w-100"
            />
            <button className="sr-only" type="submit">
                Search
            </button>
        </form>
    );
};

export default AdminSearch;
