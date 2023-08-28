import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

const EditPost: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    // Fetch the post to be edited
    const fetchData = async () => {
      const response = await fetch(`/api/post/${router.query.id}`);
      const postData = await response.json();
      setTitle(postData.title);
      setContent(postData.content);
    };

    fetchData();
  }, [router.query.id]);

  const updatePost = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const body = { title, content };

    await fetch(`/api/edit/${router.query.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    router.push("/drafts");
  };

  return (
    <Layout>
      <div className="flex justify-center items-center bg-gray-100 p-12">
        <form onSubmit={updatePost} className="flex flex-col">
          <h1 className="text-xl mb-4">Edit Post</h1>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            className="border p-2 mb-4 rounded-md"
          />
          <textarea
            value={content}
            autoFocus
            cols={50}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            className="border p-2 rounded-md"
          />
          <button
            type="submit"
            className="bg-gray-300 py-2 px-6 rounded-md mb-4"
          >
            Save Changes
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

export default EditPost;
