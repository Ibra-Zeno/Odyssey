import { Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
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
      const response = await fetch(`/api/search?q=${query}`);
      const results: SearchResult[] = await response.json();
      setSearchResults(results);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (data: any) => {
    handleSearch(data.query);
  };

  const handleIconClick = () => {
    handleSearchSubmit(form.getValues());
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
    <div className="relative">
      <Input
        {...form.register("query")}
        className="rounded-md border-2 border-gray-400 border-opacity-25 bg-slate-600 py-2 pl-3 text-slate-300 placeholder-slate-400 focus:ring-red-400 xl:w-64"
        type="text"
        placeholder="Search..."
        autoComplete="off"
        onKeyDown={handleKeyPress}
      />
      <div
        className="pointer absolute right-0 top-0 flex h-full border-spacing-40 cursor-pointer items-center justify-center rounded-md p-2"
        onClick={handleIconClick}
      >
        <Search size={20} className="pointer flex items-center" />
      </div>
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-11 max-h-64 w-full overflow-y-auto rounded-lg border-l-2 border-r-2 border-gray-400 border-opacity-25 bg-slate-600 shadow-md"
        >
          {searchResults.map((result, index) => (
            <Link key={result.id} href={`/p/${result.id}`}>
              <div className="cursor-pointer border-t-2 border-slate-300  border-opacity-5 px-2 py-4 hover:bg-slate-700">
                {result.title}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
