import { useState } from "react";
import { useRouter } from "next/router";
import QuillEditor from "../components/QuillEditor";
import Layout from "../components/Layout";

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  // Send a POST request to the API to create a new draft
  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const body = { title, content };

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
      <div className="flex justify-center items-center bg-gray-100 p-12">
        <form onSubmit={submitData} className="flex flex-col">
          <h1 className="text-xl mb-4">New Draft</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
            className="border p-2 mb-4 rounded-md"
          />
          <QuillEditor content={content} setContent={setContent} />
          <button
            type="submit"
            disabled={!content || !title}
            className="bg-gray-300 py-2 px-6 rounded-md mb-4"
          >
            Create
          </button>
          <a
            className="text-blue-500 hover:underline cursor-pointer ml-4"
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

// 3. Add date and locations
