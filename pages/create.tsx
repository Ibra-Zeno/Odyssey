import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Layout from "../components/Layout";

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const body = { title, content };
    console.log(body);
    console.log(JSON.stringify(body));
    console.log(session);

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
          <textarea
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
            className="border p-2 rounded-md"
          />
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

// To do:
// 1. Implement a RTE
// 2. Sanitize input when sending to database
// 3. Add date and locations
