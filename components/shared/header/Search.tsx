"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

const Search = ({ debounceMs = 500 }: { debounceMs?: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the input in sync when the URL query changes externally (back/forward,
  // a filter link, etc.). React's "adjust state during render" pattern.
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setValue(urlQuery);
  }

  const buildUrl = (query: string) => {
    // Preserve existing filters (category, price, rating, sort, ...).
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = query.trim();

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    // A new search restarts pagination from the first page.
    params.delete("page");

    const qs = params.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  const pushQuery = (query: string) => {
    if (query.trim() === urlQuery.trim()) return;
    router.push(buildUrl(query), { scroll: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setValue(next);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushQuery(next), debounceMs);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    pushQuery(value);
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="flex w-full gap-2">
      <div className="flex w-full gap-1">
        <Input
          name="q"
          type="text"
          placeholder="Search..."
          value={value}
          onChange={handleChange}
          autoComplete="off"
          aria-label="Search products"
          className="h-7 w-full text-sm md:w-50 lg:w-75"
        />
        <button
          type="submit"
          aria-label="Search"
          className="h-7 rounded-md bg-green-500 px-1 text-white transition-colors duration-300 hover:bg-green-600"
        >
          <SearchIcon className="h-4 w-5" />
        </button>
      </div>
    </form>
  );
};

export default Search;
