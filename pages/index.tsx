import prisma from "../lib/prisma";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import Post from "../components/Post";
import Router from "next/router";
import Link from "next/link";
import Hero from "../components/Hero";
import { Separator } from "@/components/ui/separator";
import Like from "../components/Like";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, MapPin, Flame } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { tagsArray, tagColourMap } from "../utils/tags";
import { PostProps, BlogProps } from "../utils/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

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

  const handleAuthorClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.stopPropagation(); // Prevent the click event from propagating to the parent container
  };

  return (
    <>
      <Layout>
        <Hero />
        <div>
          {/* Top Like Posts */}
          <section className="isolate z-30 mx-auto flex w-full flex-col flex-wrap overflow-y-visible rounded border-4 border-pal2/10 bg-[#697987]/40 p-1 shadow-xl backdrop-blur-lg md:p-4">
            <div className="mb-4 flex flex-row items-end justify-center gap-x-2 pt-2">
              <Flame
                className="rounded-full fill-amber-700 p-[2px] text-red-500"
                strokeWidth={1.8}
              />
              <h4 className="font-display text-sm font-semibold text-palText">
                Hot Posts
              </h4>
            </div>
            <ul className="flex flex-col gap-y-2 sm:grid sm:grid-cols-2 sm:gap-x-3 lg:grid lg:grid-cols-3 ">
              {topLikedPosts.map((post) => {
                const avatarImage = post?.author?.image || undefined;
                const handlePostClick = () => {
                  Router.push("/p/[id]", `/p/${post.id}`);
                };
                const authorName = post.author
                  ? post.author.name
                  : "Unknown author";
                return (
                  <li
                    key={post.id}
                    className="mx-2 flex cursor-pointer flex-row gap-x-2 rounded bg-[#0f3951]/80 p-4 transition-all duration-300 ease-in-out hover:bg-[#0f3951]/95 sm:gap-x-4 md:p-6 lg:mx-0"
                    onClick={handlePostClick}
                  >
                    <div>
                      <MapPin
                        opacity={0.6}
                        // size={42}
                        className="text-pal h-6 w-6 rounded  text-zinc-600/75 md:h-10 md:w-10"
                      />
                    </div>
                    <div className="flex h-full w-full flex-col justify-between">
                      <h2 className="mb-5 w-fit cursor-pointer font-display text-xs font-bold tracking-wide text-palText sm:text-sm sm:font-semibold">
                        {post.title}
                      </h2>
                      <div className="flex w-full flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-x-2">
                          <Link
                            className="flex cursor-pointer flex-row items-center gap-x-2"
                            href={
                              authorName !== "Unknown author"
                                ? `/profile/${post.author?.email}`
                                : ""
                            }
                            onClick={handleAuthorClick}
                          >
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={avatarImage}
                                alt={authorName ?? undefined}
                              />
                              <AvatarFallback className="">
                                {authorName}
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-noto text-[10px] text-palText transition-colors duration-200 ease-in-out hover:text-[#c84575]/80">
                              {authorName}
                            </p>
                          </Link>
                        </div>
                        <div className="flex w-fit items-end gap-x-4">
                          <Like post={post} colorMode="light" />
                          <div className="flex flex-row items-center text-sm">
                            <MessageCircle
                              size={16}
                              className="fill-none text-palText"
                            />
                            <span className="ml-1 text-palText">
                              {post.commentCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
          <div className="relative flex h-full flex-col lg:flex-row">
            <main className="order-2 mt-8 w-full flex-[3] lg:order-none lg:mt-16">
              {/* Pagination (need to test!) */}
              <div className="flex flex-col gap-y-4 lg:mr-4">
                {paginatedPosts.map((post) => (
                  <div key={post.id}>
                    <div className="rounded bg-transparent text-white ">
                      <Post post={post} />
                    </div>
                    <Separator className="mx-auto h-[2px] w-[98%] rounded-full bg-pal2/30" />
                  </div>
                ))}
              </div>
              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`${
                        i + 1 === currentPage
                          ? "bg-pal4 text-white"
                          : "bg-pal1 text-gray-600 transition-all duration-300 ease-in-out hover:bg-pal4 hover:text-white"
                      } mx-1 rounded px-4 py-2 font-noto font-bold`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </main>
            {/* Aside for all 12 tags */}
            <aside className="mt-8 flex flex-1 flex-col md:mt-16">
              {/* Show the "Show Feed" button */}
              <div className="sticky top-12 flex h-fit flex-col border-y-2 border-pal6/50 py-2.5">
                {selectedTag && (
                  <div className="relative mb-4 flex justify-center">
                    <Badge
                      className="cursor-pointer bg-pal4 px-4 py-1 font-display text-xs font-bold tracking-wide text-stone-50 shadow-lg hover:bg-pal6 focus:bg-pal6 md:text-sm"
                      onClick={handleShowFeed}
                    >
                      Show All
                    </Badge>
                  </div>
                )}
                {/* All 12 tags */}
                <div className="relative flex w-full flex-row flex-wrap items-center justify-center">
                  {tagsArray.map((tag, i) => (
                    <div
                      key={i}
                      className="h-fit w-fit bg-transparent px-1 py-0.5 "
                    >
                      <Badge
                        variant="outline"
                        className="border border-[#988085] bg-[#bea5aa] font-sans text-xs text-stone-900 shadow-md hover:border-stone-500/40 hover:bg-pal4 hover:text-stone-50 focus:border-stone-500/40 focus:bg-pal4 focus:text-stone-50 md:px-2.5 md:text-sm"
                        onClick={() => setSelectedTag(tag)}
                        style={{ cursor: "pointer" }}
                      >
                        {tag}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Layout>
      <Head>
        <title>Odyssey</title>
        <meta
          name="description"
          content="Odyssey Oracles, a community of global storytellers where you can share your experiences, emotions, and imagination while exploring the world through the eyes of others."
        />
        <meta
          name="keywords"
          content="Oracles of the Odyssey, Global, Blog, Create, Upload, Like, Comment, Publish, Community Uploads, Community, Uploads, Oracles, Odyssey, Whispers, Earth"
        />
        <meta name="author" content="Ibrahim Kalam" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
};

export default Blog;
