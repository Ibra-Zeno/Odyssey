import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  query: z.string().nonempty(),
});

const SearchBar: React.FC = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Track debounced query

  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onBlur", // ?what is this?
    defaultValues: {
      query: "",
    },
  });

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/search?q=${query}`);
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedQuery) {
      setIsLoading(true);
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    // Use lodash's debounce function or other debounce libraries here
    const debounceTimer = setTimeout(() => {
      setDebouncedQuery(form.watch("query"));
    }, 300); // Debounce time (e.g., 300ms)

    return () => clearTimeout(debounceTimer);
  }, [form.watch("query")]);

  return (
    <Form {...form}>
      <form className="flex flex-row gap-x-2">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  className="bg-slate-600 text-slate-300 focus-visible:ring-red-400"
                  type="text"
                  placeholder="Search..."
                />
              </FormControl>
            </FormItem>
          )}
        />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="bg-gray-700 rounded-md p-2">
              {/* Your SVG icon */}
            </div>
          </DropdownMenuTrigger>
          {isLoading ? (
            <DropdownMenuContent>
              <DropdownMenuItem>Loading...</DropdownMenuItem>
            </DropdownMenuContent>
          ) : (
            <DropdownMenuContent>
              {searchResults.length === 0 ? (
                <DropdownMenuItem>No results found</DropdownMenuItem>
              ) : (
                searchResults.map((result: any) => (
                  <DropdownMenuItem key={result.id}>
                    <Link href={`/p/${result.id}`}>{result.title}</Link>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      </form>
    </Form>
  );
};

export default SearchBar;
