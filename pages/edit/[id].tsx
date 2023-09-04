import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import QuillEditor from "../../components/QuillEditor";
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
      <div className="flex items-center justify-center bg-gray-100 p-12">
        <form onSubmit={updatePost} className="flex flex-col">
          <h1 className="mb-4 text-xl">Edit Post</h1>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            className="mb-4 rounded-md border p-2"
          />
          <QuillEditor content={content} setContent={setContent} />
          <button
            type="submit"
            className="mb-4 rounded-md bg-gray-300 px-6 py-2"
          >
            Save Changes
          </button>
          <a
            className="ml-4 cursor-pointer text-blue-500 hover:underline"
            onClick={() => router.push(`/p/${router.query.id}`)}
          >
            or Cancel
          </a>
        </form>
      </div>
    </Layout>
  );
};

export default EditPost;
