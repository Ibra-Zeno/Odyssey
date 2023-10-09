import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Layout from "../../components/Layout";
import { tagsArray } from "../../utils/tags";

const QuillEditor = dynamic(() => import("../../components/QuillEditor"), {
  ssr: false, // This will load the component on the client side only
  loading: () => <p>Loading editor...</p>, // Optional loading component
});

const EditPost: React.FC = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    // Fetch the post to be edited
    const fetchData = async () => {
      const response = await fetch(`/api/post/${router.query.id}`);
      const postData = await response.json();
      setTitle(postData.title);
      setSelectedTags(postData.tags);
      setContent(postData.content);
    };

    fetchData();
  }, [router.query.id]);

  const updatePost = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const body = { title, content, tags: selectedTags };

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
