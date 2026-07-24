"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";

const AdminSearch = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    let formActionUrl = "";

    if (pathname.includes("/admin/orders")) {
        formActionUrl = "/admin/orders";
    } else if (pathname.includes("/admin/users")) {
        formActionUrl = "/admin/users";
    } else {
        formActionUrl = "/admin/products";
    }

    const queryValue = searchParams.get("query") || "";

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
