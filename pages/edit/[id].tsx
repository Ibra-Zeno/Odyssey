import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Layout from "../../components/Layout";
import { tagsArray } from "../../utils/tags";
import Select from "react-select";

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
      // Use optional chaining to ensure that properties exist
      setTitle(postData?.title || "");
      setContent(postData?.content || "");

      const deduplicatedTags = Array.from(
        new Set(
          postData?.tags?.map(
            (obj: { tag: { name: string } }) => obj.tag.name,
          ) || [],
        ),
      );

      setSelectedTags(deduplicatedTags as string[]);
    };

    fetchData();
  }, [router.query.id]);

  const updatePost = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const body = { title, content, tags: selectedTags };

    const response = await fetch(`/api/edit/${router.query.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Update Error:", errorData.error);
    } else {
      router.push("/drafts");
    }
  };

  const options = tagsArray.map((tag) => ({
    value: tag,
    label: tag,
  }));
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
          <Select
            options={options}
            isMulti
            onChange={(selected) =>
              setSelectedTags(selected.map((tag) => tag.value))
            }
            value={selectedTags.map((obj) => ({ value: obj, label: obj }))}
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
