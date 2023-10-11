import prisma from "../lib/prisma";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post from "../components/Post";
import Like from "../components/Like";
import { MessageSquare } from "lucide-react";
import { tagsArray, tagColourMap } from "../utils/tags";
import { useSession } from "next-auth/react";
import { PostProps, BlogProps } from "../utils/types";
import { useState, useEffect } from "react";

const postsPerPage = 10;

export const getStaticProps: GetStaticProps = async () => {
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
    take: 5, // Get the top 5 liked posts
  });
  const tagPosts = await prisma.tag.findMany({
    where: { name: { in: tagsArray } },
    include: {
      posts: {
        include: {
          post: {
            include: {
              Like: { select: { id: true } },
              Comment: { select: { id: true } },
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
    props: { feed, tagPosts, topLikedPostsResponse }, // Pass tagPosts as a prop here
    revalidate: 10,
  };
};

const Blog: React.FC<BlogProps> = ({
  feed,
  tagPosts,
  topLikedPostsResponse,
}) => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1); // Initialize the current page

  console.log(feed[0]);
  console.log(tagPosts[0]);
  console.log(topLikedPostsResponse[0]);

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
        ?.posts.map((post) => post.post) || []
    : feed.slice(startIndex, endIndex);

  const totalPages = Math.ceil(
    (selectedTag ? paginatedPosts.length : feed.length) / postsPerPage,
  );

  return (
    <Layout>
      <div className="page flex flex-row gap-x-6">
        <main className="flex-[3]">
          <h1 className="text-2xl font-bold">Public Feed</h1>
          <section className="flex flex-row flex-wrap items-center gap-4">
            {tagsArray.map((tag, i) => (
              <div
                key={i}
                className="flex h-12 w-[15%] items-center justify-center rounded bg-white/[0.15]"
              >
                <span
                  className={`${tagColourMap[tag]} rounded px-2 py-1`}
                  onClick={() => setSelectedTag(tag)}
                  style={{ cursor: "pointer" }}
                >
                  {tag}
                </span>
              </div>
            ))}
          </section>

          {/* Show the "Show Feed" button if a tag is selected */}
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

          {paginatedPosts.map((post) => (
            <div key={post.id} className="post mt-8 rounded bg-[#CBE4DE] ">
              <Post post={post} />
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

        {/* Aside for top liked posts */}
        <aside className="mt-8 flex-1">
          <h2 className="mb-4 text-xl font-bold">Top Liked Posts</h2>
          <div className="rounded bg-pal2 p-2">
            {topLikedPosts.map((post) => {
              const authorName = post.author
                ? post.author.name
                : "Unknown author";
              return (
                <div key={post.id} className="mb-4 rounded bg-pal3">
                  <h2>{post.title}</h2>
                  <h5 className="text-xs">By {authorName}</h5>
                  <div className="mt-4 flex items-center">
                    <Like post={post} />
                    <div className="flex flex-row text-sm">
                      <MessageSquare />
                      <span className="ml-2">{post.commentCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </Layout>
  );
};

export default Blog;
