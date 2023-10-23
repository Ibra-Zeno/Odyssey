import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useToast } from "@/components/ui/use-toast";
import Head from "next/head";
import Layout from "../components/Layout";
import { tagsArray } from "../utils/tags";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const { toast } = useToast();

  if (!session) {
    return (
      <Layout>
        <section className="flex h-full w-full flex-col items-center justify-center">
          <h3 className="mb-4 mt-24 font-display text-5xl font-bold text-stone-300">
            You need to be signed in to create a post.
          </h3>
          <Button
            className="mt-8 bg-pal4 font-display text-base font-bold tracking-wide hover:bg-pal6"
            onClick={() => router.push("/api/auth/signin")}
          >
            Sign in
          </Button>
        </section>
      </Layout>
    );
  }

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
        toast({
          title: "Post created 🎉",
          description: "Your post has been saved to drafts.",
        });
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
    <>
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
        <div className="isolate mx-auto my-6 flex min-h-[80vh] max-w-6xl items-center justify-center rounded bg-pal3/90 p-3 py-6 shadow-lg md:my-0 md:p-12">
          <form
            onSubmit={submitData}
            className="flex w-full max-w-3xl flex-col"
          >
            <h3 className="mb-2 font-display text-lg font-bold text-[#350013] md:mb-4 md:text-2xl">
              New Draft
            </h3>
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
                className="bg-pal4 font-display text-sm font-bold tracking-wide text-stone-50 shadow-lg hover:bg-pal6"
              >
                Save
              </Button>
              <Button
                className="ml-4 cursor-pointer font-display text-sm font-bold tracking-wide shadow-lg"
                variant={"destructive"}
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Layout>
      <Head>
        <title>New Draft</title>
      </Head>
    </>
  );
};

export default Draft;
