import { Search, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Separator } from "./ui/separator";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

const formSchema = z.object({
  query: z.string().nonempty(),
});

type SearchResult = {
  id: string;
  title: string;
};

const SearchBar: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      query: "",
    },
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      setShowDropdown(true);
      const response = await fetch(`/api/search?q=${query}`);
      const results: SearchResult[] = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (data: any) => {
    handleSearch(data.query);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearchSubmit(form.getValues());
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedQuery(form.watch("query"));
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [form.watch("query")]);

  useEffect(() => {
    window.addEventListener("click", handleOutsideClick);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="pointer-events-auto relative max-w-xs md:max-w-none">
      <Input
        {...form.register("query")}
        className="mx-auto w-72 rounded-md border-2 border-gray-400 border-opacity-25 bg-stone-200 py-2 pl-3 text-stone-700 placeholder-blue-700 focus:ring focus:ring-red-400 md:w-80 lg:w-96"
        type="text"
        placeholder="Search..."
        autoComplete="off"
        onKeyDown={handleKeyPress}
      />
      <div className="pointer absolute right-0 top-0 flex h-full border-spacing-40 cursor-pointer items-center justify-center rounded-md p-2">
        <Search
          size={20}
          className="pointer flex items-center text-stone-700"
        />
      </div>
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-10 z-50 max-h-64 w-full overflow-y-auto rounded-lg border-x-2 border-x-gray-400 border-opacity-25 bg-stone-200 shadow-md"
        >
          {isLoading ? (
            <div className="flex justify-center border-t-2 border-slate-300  border-opacity-5 px-2 py-4 ">
              <Loader2 className="animate-spin text-stone-700" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-4 text-center font-semibold text-stone-700">
              No results found.
            </div>
          ) : (
            searchResults.map((result, index) => (
              <Link key={result.id} href={`/p/${result.id}`}>
                <div className="cursor-pointer border-t-2 border-slate-300 border-opacity-5 px-2 py-5 font-noto  text-sm font-semibold text-stone-700 hover:bg-stone-300">
                  {result.title}
                </div>
                <Separator className="mx-auto w-[90%] bg-stone-500/50" />
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
