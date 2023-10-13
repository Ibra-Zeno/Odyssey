import prisma from "../lib/prisma";
import { GetServerSidePropsContext } from "next";
import Layout from "../components/Layout";
import Post from "../components/Post";
import Carousel from "@/components/Carousel";
import Router from "next/router";
import Hero from "../components/Hero";
import { Separator } from "@/components/ui/separator";
import Like from "../components/Like";
import { Badge } from "@/components/ui/badge";
import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { tagsArray, tagColourMap } from "../utils/tags";
import { PostProps, BlogProps } from "../utils/types";
import { useState, useEffect } from "react";

const postsPerPage = 10;

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: true,
      Like: true,
      Comment: { select: { id: true } },
      tags: {
        include: { tag: true },
      },
    },
  });
  const topLikedPostsResponse = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: true,
      Comment: { select: { id: true } },
      tags: { include: { tag: true } },
      Like: { select: { id: true } }, // Include only the 'id' of likes
    },
    orderBy: [{ Like: { _count: "desc" } }], // Order by the count of likes in descending order
    take: 6, // Get the top 5 liked posts
  });
  const tagPosts = await prisma.tag.findMany({
    include: {
      posts: {
        include: {
          post: {
            include: {
              author: true,
              Like: { select: { id: true } },
              Comment: { select: { id: true } },
              tags: {
                include: { tag: true },
              },
            },
          },
        },
        where: { post: { published: true } },
      },
    },
  });
  return {
    props: { feed, tagPosts, topLikedPostsResponse }, // Pass tagPosts as a prop here
  };
};

const Blog: React.FC<BlogProps> = ({
  feed,
  tagPosts,
  topLikedPostsResponse,
}) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // Initialize the current page

  const topLikedPosts = topLikedPostsResponse.map((post) => ({
    ...post,
    likesCount: post.Like.length,
    comments: [],
    commentCount: post.Comment.length,
    likes: [],
    tags: [], // Add an empty array for the tags property
  }));

  const handleShowFeed = () => {
    setSelectedTag(null); // Reset selectedTag to null to show the feed
  };

  // Calculate the range of posts to display based on the current page
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const paginatedPosts = selectedTag
    ? tagPosts
        .find((tagPost) => tagPost.name === selectedTag)
        ?.posts.filter((postRelation) => postRelation.post.published) // Filter only published posts.
        .map((postRelation) => postRelation.post) || []
    : feed.slice(startIndex, endIndex);

  const totalPages = Math.ceil(
    (selectedTag ? paginatedPosts.length : feed.length) / postsPerPage,
  );

  return (
    <Layout>
      <Hero />
      <div className="mt-44 gap-x-6">
        {/* Top Like Posts */}
        <section className="isolate z-30 flex flex-col flex-wrap gap-4 overflow-y-visible">
          {/* <div className="grid grid-cols-3 gap-x-2 rounded bg-sky-950 p-4 pb-2"> */}
          {/* {topLikedPosts.map((post) => {
              const avatarImage = post?.author?.image || undefined;
              const handlePostClick = () => {
                Router.push("/p/[id]", `/p/${post.id}`);
              };
              const authorName = post.author
                ? post.author.name
                : "Unknown author";
              return (
                <div
                  key={post.id}
                  className="mr-4 flex w-[300px] flex-shrink-0 flex-col items-baseline justify-between rounded bg-stone-50 p-2 shadow-lg"
                >
                  <h2
                    className="w-fit cursor-pointer font-display text-sm font-medium tracking-wide"
                    onClick={handlePostClick}
                  >
                    {post.title}
                  </h2>
                  <div className="flex w-full flex-row justify-between">
                    <div className="ml-2 mt-4 flex flex-row gap-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={avatarImage}
                          alt={authorName ?? undefined}
                        />
                        <AvatarFallback className="">
                          {authorName}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-noto text-xs">{authorName}</p>
                    </div>
                    <div className="flex w-fit items-end gap-x-4">
                      <Like post={post} />
                      <div className="flex flex-row items-center text-sm">
                        <MessageCircle size={16} className="fill-none" />
                        <span className="ml-1">{post.commentCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })} */}
          <Carousel topLikedPosts={topLikedPosts} />
        </section>
        <div className="flex flex-row">
          <main className="flex-[4]">
            <h1 className="text-2xl font-bold">Public Feed</h1>

            {/* Pagination (need to test!) */}
            {paginatedPosts.map((post) => (
              <div key={post.id}>
                <div className="rounded bg-transparent text-white ">
                  <Post post={post} />
                </div>
                <Separator className="mx-auto w-[95%] opacity-40" />
              </div>
            ))}
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`${
                      i + 1 === currentPage
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-gray-600"
                    } mx-1 rounded px-4 py-2`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
          {/* Aside for all 12 tags */}
          <aside className="sticky top-8 mt-8 h-fit w-full flex-1">
            {tagsArray.map((tag, i) => (
              <div
                key={i}
                className="inline-flex h-fit w-fit bg-transparent px-1 py-0.5 "
              >
                <Badge
                  variant="outline"
                  className={`${tagColourMap[tag]} border-gray-400/30 font-display tracking-wide text-gray-700 shadow-md `}
                  onClick={() => setSelectedTag(tag)}
                  style={{ cursor: "pointer" }}
                >
                  {tag}
                </Badge>
              </div>
            ))}
            {/* Show the "Show Feed" button */}
            {selectedTag && (
              <div className="mt-4 flex justify-center">
                <button
                  className="rounded bg-blue-500 px-4 py-2 text-white"
                  onClick={handleShowFeed}
                >
                  Show All
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
