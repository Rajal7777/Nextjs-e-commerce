"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

const Search = () => {
  const searchParams = useSearchParams();
  const queryValue = searchParams.get("q") ?? "";

  return (
    <form action="/search" method="GET" className="flex w-full gap-2">
      <div className="flex w-full gap-1">
        <Input
          name="q"
          type="text"
          placeholder="Search..."
          defaultValue={queryValue}
          className="h-7 w-full text-sm md:w-50 lg:w-75"
        />
        <button
          type="submit"
          className="h-7 rounded-md bg-green-500 px-1 text-white transition-colors duration-300 hover:bg-green-600"
        >
          <SearchIcon className="h-4 w-5" />
        </button>
      </div>
    </form>
  );
};

export default Search;
