// components/SearchResults.tsx
import React from "react";
import Link from "next/link";
const SearchResults: React.FC<{ results: any[] }> = ({ results }) => {
  return (
    <div className="mt-4 absolute bg-gray-300 left-1/2 top-10">
      <ul className="list-disc pl-6">
        {results.map((result) => (
          <li key={result.id} className="mb-2">
            <Link href={`/p/${result.id}`}>
              <p className="text-blue-500 hover:underline">{result.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
