import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Layout from "../components/Layout";
import { tagsArray } from "../utils/tags";

// Dynamically import the QuillEditor component
const QuillEditor = dynamic(() => import("../components/QuillEditor"), {
  ssr: false, // This will load the component on the client side only
  loading: () => <p>Loading editor...</p>, // Optional loading component
});

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const router = useRouter();

  // Send a POST request to the API to create a new draft
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const body = { title, content, tags: selectedTags };

    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      // Assuming the response indicates success (e.g., a status code 201)
      if (response.status === 201) {
        await router.push("/drafts");
      } else {
        console.error("Failed to create post:", response.statusText);
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center bg-gray-100 p-12">
        <form onSubmit={submitData} className="flex flex-col">
          <h1 className="mb-4 text-xl">New Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
            className="mb-4 rounded-md border p-2"
          />
          <label htmlFor="tags" className="mb-1 block">
            Select Tags
          </label>
          <select
            id="tags"
            className="mb-4 rounded-md border p-2"
            value={selectedTags}
            multiple
            onChange={(e) =>
              setSelectedTags(
                Array.from(e.target.selectedOptions, (item) => item.value),
              )
            }
          >
            {tagsArray.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <QuillEditor content={content} setContent={setContent} />
          <button
            type="submit"
            disabled={!content || !title}
            className="mb-4 rounded-md bg-gray-300 px-6 py-2"
          >
            Create
          </button>
          <a
            className="ml-4 cursor-pointer text-blue-500 hover:underline"
            onClick={() => router.push("/")}
          >
            or Cancel
          </a>
        </form>
      </div>
    </Layout>
  );
};

export default Draft;
