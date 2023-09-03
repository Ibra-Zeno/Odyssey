import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    console.log("Search results: ", query);
  }, [query]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(query);
    try {
      const response = await fetch(`/api/search?q=${query}`);
      console.log("Response: ", response);
      const results = await response.json();
      console.log("Results: ", results);
      setSearchResults(results);
      console.log("Search results: ", searchResults);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  return (
    <form onSubmit={(e) => handleSearch(e)} className="flex flex-row gap-x-2">
      <Input
        className="bg-slate-600 text-slate-300 focus-visible:ring-red-400"
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <DropdownMenu>
        <DropdownMenuTrigger>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            className="bg-gray-700 rounded-md"
            onClick={(e) => handleSearch(e)}
          >
            <path
              fill="#fff"
              d="M10.77 18.3a7.53 7.53 0 1 1 7.53-7.53a7.53 7.53 0 0 1-7.53 7.53Zm0-13.55a6 6 0 1 0 6 6a6 6 0 0 0-6-6Z"
            ></path>
            <path
              fill="#fff"
              d="M20 20.75a.74.74 0 0 1-.53-.22l-4.13-4.13a.75.75 0 0 1 1.06-1.06l4.13 4.13a.75.75 0 0 1 0 1.06a.74.74 0 0 1-.53.22Z"
            ></path>
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {searchResults.length > 0 &&
            searchResults.map((result: any) => (
              <DropdownMenuItem key={result.id}>
                <Link href={`/p/${result.id}`}>{result.title}</Link>
              </DropdownMenuItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </form>
  );
};

export default SearchBar;
