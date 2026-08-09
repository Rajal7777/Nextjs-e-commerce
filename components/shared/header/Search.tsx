import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/product-actions";
import { SearchIcon } from "lucide-react";

const Search = async () => {
    const categories = await getAllCategories();

    return (
                <form action="/search" method="GET" className="flex w-full gap-2">
          <div className="hidden">
              <Select name="category" >
                <SelectTrigger className="w-45">
                    <SelectValue placeholder="All" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem key="All" value="all">
                        All
                    </SelectItem>
                    {categories.map((x) => (
                        <SelectItem key={x.category} value={x.category}>
                            {x.category}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

            <div className="flex w-full gap-1">
                <Input
                    name="q"
                    type="text"
                    placeholder="Search..."
                    className="h-7 w-full text-sm md:w-50 lg:w-75"
                />
               <button type="submit" className="h-7 rounded-md bg-green-500 px-1 text-white transition-colors duration-300 hover:bg-green-600">
                   <SearchIcon className="h-4 w-5" />
               </button>
            </div>
        </form>
    );
};

export default Search;
