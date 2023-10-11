import prisma from "../lib/prisma";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post from "../components/Post";
import { tagsArray, tagColourMap } from "../utils/tags";
import { useSession } from "next-auth/react";
import { PostProps, BlogProps } from "../utils/types";
import { useState } from "react";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: true,
      tags: {
        include: { tag: true },
      },
    },
  });
  const tagPosts = await prisma.tag.findMany({
    where: { name: { in: tagsArray } },
    include: {
      posts: {
        include: {
          post: {
            include: {
              tags: {
                include: { tag: true },
              },
            },
          },
        },
      },
    },
  });
  return {
    props: { feed, tagPosts }, // Pass tagPosts as a prop here
    revalidate: 10,
  };
};

const Blog: React.FC<BlogProps> = ({ feed, tagPosts }) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const filteredPosts = selectedTag
    ? tagPosts
        .find((tagPost) => tagPost.name === selectedTag)
        ?.posts.map((post) => post.post) || []
    : feed;

  return (
    <Layout>
      <div className="page">
        <h1 className="text-2xl font-bold">Public Feed</h1>
        <main>
          <section className="flex w-full flex-row flex-wrap items-center justify-center gap-4">
            {tagsArray.map((tag, i) => (
              <div
                key={i}
                onClick={() => setSelectedTag(tag)}
                className="flex h-20 w-[15%] cursor-pointer items-center justify-center rounded bg-gray-300/10"
              >
                <span
                  className={`${tagColourMap[tag]} rounded px-2 py-1 text-sm font-semibold tracking-wide text-gray-950`}
                >
                  {tag}
                </span>
              </div>
            ))}
          </section>

          {filteredPosts.map((post) => (
            <div key={post.id} className="post mt-8 rounded bg-[#CBE4DE] ">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Blog;
