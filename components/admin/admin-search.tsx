"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

type AdminSearchProps = {
   placeholder?: string;
    actionPath: string;
    debounceMs?: number;
};


const AdminSearch = ({
    placeholder = "Search...",
    actionPath,
    debounceMs = 400,
}: AdminSearchProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const urlQuery = searchParams.get("query") ?? "";
    const [value, setValue] = useState(urlQuery);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
    if (urlQuery !== prevUrlQuery) {
        setPrevUrlQuery(urlQuery);
        setValue(urlQuery);
    }

    const buildUrl = (query: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const trimmed = query.trim();

        if (trimmed) {
            params.set("query", trimmed);
        } else {
            params.delete("query");
        }

        // A new search must restart pagination from the first page.
        params.delete("page");

        const qs = params.toString();
        return qs ? `${actionPath}?${qs}` : actionPath;
    };

    const pushQuery = (query: string) => {
        // Avoid a redundant navigation when the query hasn't actually changed.
        if (query.trim() === urlQuery.trim()) return;
        router.replace(buildUrl(query), { scroll: false });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value;
        setValue(next);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => pushQuery(next), debounceMs);
    };

    const handleClear = () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setValue("");
        pushQuery("");
    };

    // Submit immediately on Enter without waiting for the debounce.
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        pushQuery(value);
    };

    return (
        <form
            onSubmit={handleSubmit}
            role="search"
            className="relative w-full sm:w-72 md:w-80"
        >
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="text"
                name="query"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                aria-label={placeholder}
                autoComplete="off"
                className="h-9 w-full pl-8 pr-8"
            />
            {value && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    aria-label="Clear search"
                    className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </form>
    );
};

export default AdminSearch;
