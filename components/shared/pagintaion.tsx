"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";

type PaginationProps = {
    page: number | string;
    totalPages: number;
    urlParamName?: string;
};

const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

   
    const pageNumber = Number(page);
    const currentPage = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;

    function handleClick(btnType: string) {
        const pageValue = btnType === "next" ? currentPage + 1 : currentPage - 1;
        const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: urlParamName || "page",
            value: pageValue.toString(),
        });

        router.push(newUrl, { scroll: false});
    }

    return (
        <div className="flex gap-2">
            <Button
                size="lg"
                variant="outline"
                disabled={currentPage <= 1}
                onClick={() => handleClick("prev")}
            >
                Previous
            </Button>

            <Button
                size="lg"
                variant="outline"
                disabled={currentPage >= totalPages}
                onClick={() => handleClick("next")}
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
