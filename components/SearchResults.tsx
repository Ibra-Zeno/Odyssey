// components/SearchResults.tsx
import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SearchResults: React.FC<{ results: any[] }> = ({ results }) => {
  return (
    <div className="absolute left-1/2 top-10 mt-4 bg-gray-300">
      <ul className="list-disc pl-6">
        <DropdownMenu>
          <DropdownMenuTrigger></DropdownMenuTrigger>
          <DropdownMenuContent>
            {results.map((result) => (
              <DropdownMenuItem key={result.id}>
                <Link href={`/p/${result.id}`}>
                  <p className="text-blue-500 hover:underline">
                    {result.title}
                  </p>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </ul>
    </div>
  );
};

export default SearchResults;

{
  /* <li key={result.id} className="mb-2">
            <Link href={`/p/${result.id}`}>
              <p className="text-blue-500 hover:underline">{result.title}</p>
            </Link>
          </li> */
}
