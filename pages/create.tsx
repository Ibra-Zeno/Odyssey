import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useToast } from "@/components/ui/use-toast";
import Layout from "../components/Layout";
import { tagsArray } from "../utils/tags";
import { Loader2 } from "lucide-react";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Dynamically import the QuillEditor component
const QuillEditor = dynamic(() => import("../components/QuillEditor"), {
  ssr: false, // This will load the component on the client side only
  loading: () => (
    <div className="flex justify-center border-t-2 border-slate-300  border-opacity-5 px-2 py-4 ">
      <Loader2 className="animate-spin text-stone-700" />
    </div>
  ), // Optional loading component
});

const Draft: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const router = useRouter();
  const { toast } = useToast();

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
        <form onSubmit={submitData} className="flex w-full max-w-3xl flex-col">
          <h1 className="mb-4 font-display text-2xl font-bold text-[#350013]">
            New Draft
          </h1>
          <Input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
            className="mb-4 rounded-md border bg-stone-50 p-2"
          />
          <Select
            options={options}
            isMulti
            placeholder="Select tags"
            className="rounded-md bg-stone-50 font-noto text-sm"
            onChange={(selected) =>
              setSelectedTags(selected.map((tag) => tag.value))
            }
            value={selectedTags.map((tag) => ({ value: tag, label: tag }))}
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
                  title: "Post created 🎉",
                  description: "Your post has been saved to drafts.",
                });
              }}
              className="bg-pal4 px-6 font-display text-base font-bold tracking-wide text-stone-50 shadow-lg hover:bg-pal6"
            >
              Save
            </Button>
            <Button
              className="ml-4 cursor-pointer font-display text-base font-bold tracking-wide shadow-lg"
              variant={"destructive"}
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Draft;
