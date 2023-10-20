import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import Layout from "../../components/Layout";
import { tagsArray } from "../../utils/tags";
import Select from "react-select";

const QuillEditor = dynamic(() => import("../../components/QuillEditor"), {
  ssr: false, // This will load the component on the client side only
  loading: () => (
    <div className="flex justify-center border-t-2 border-slate-300  border-opacity-5 px-2 py-4 ">
      <Loader2 className="animate-spin text-stone-700" />
    </div>
  ),
});

const EditPost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const router = useRouter();
  const { toast } = useToast();

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
      router.push("/");
    }
  };

  const options = tagsArray.map((tag) => ({
    value: tag,
    label: tag,
  }));
  return (
    <Layout>
      <div className="pointer-events-none absolute inset-0 -z-0">
        <Image
          src="/images/Moon.svg"
          alt="Hero"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        ></Image>
      </div>
      <div className="isolate mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center rounded bg-pal3/90 p-12 shadow-lg">
        <form onSubmit={updatePost} className="flex w-full max-w-3xl flex-col">
          <h1 className="mb-4 font-display text-2xl font-bold">Edit Post</h1>
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            className="mb-4 rounded-md border bg-stone-50 p-2"
          />
          <Select
            options={options}
            className="rounded-md bg-stone-50 font-noto text-sm"
            placeholder="Select tags"
            isMulti
            onChange={(selected) =>
              setSelectedTags(selected.map((tag) => tag.value))
            }
            value={selectedTags.map((obj) => ({ value: obj, label: obj }))}
          />
          <div className="mt-6 rounded-lg bg-stone-50 font-noto">
            <QuillEditor content={content} setContent={setContent} />
          </div>
          <div className="mx-auto mt-6 flex flex-row gap-x-6">
            <Button
              type="submit"
              disabled={!content && !title}
              onClick={() => {
                toast({
                  title: "Post Edited 🎉",
                });
              }}
              className="bg-pal4 px-6 font-display text-base font-bold tracking-wide text-stone-50 shadow-lg hover:bg-pal6"
            >
              Save Changes
            </Button>
            <Button
              className="ml-4 cursor-pointer font-display text-base font-bold tracking-wide shadow-lg"
              variant={"destructive"}
              onClick={() => router.push(`/p/${router.query.id}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditPost;
