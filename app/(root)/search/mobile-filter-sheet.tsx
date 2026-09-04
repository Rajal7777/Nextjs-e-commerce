"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import FilterControls from "./filter-bar";
import { buildFilterUrl, type FilterState } from "./get-filter-url";

type FilterItem = {
    name: string;
    value: string;
};

type MobileFilterSheetProps = {
    hasActiveFilter: boolean;
    filterState: FilterState;
    category: string;
    price: string;
    rating: string;
    categoryItems: FilterItem[];
    priceItems: FilterItem[];
    ratingItems: FilterItem[];
};

export default function MobileFilterSheet({
    hasActiveFilter,
    filterState,
    category,
    price,
    rating,
    categoryItems,
    priceItems,
    ratingItems,
}: MobileFilterSheetProps) {
    const getFilterUrl = (override: Parameters<typeof buildFilterUrl>[1]) =>
        buildFilterUrl(filterState, override);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const urlKey = `${pathname}?${searchParams.toString()}`;

    const [open, setOpen] = useState(false);
    const [prevUrlKey, setPrevUrlKey] = useState(urlKey);

    // Close the sheet whenever a filter link navigates to a new URL
    if (urlKey !== prevUrlKey) {
        setPrevUrlKey(urlKey);
        setOpen(false);
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    {hasActiveFilter && (
                        <span className="flex h-2 w-2 rounded-full bg-primary" />
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-75 sm:w-87 p-6 overflow-y-auto">
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
    );
}
