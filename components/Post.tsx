import Router from "next/router";
import Like from "./Like";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle } from "lucide-react";
import { PostProps } from "../utils/types";
import { Badge } from "@/components/ui/badge";
import { tagColourMap } from "../utils/tags";

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  const avatarImage = post?.author?.image || undefined;

  const handlePostClick = () => {
    Router.push("/p/[id]", `/p/${post.id}`);
  };
  const handleAuthorClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.stopPropagation(); // Prevent the click event from propagating to the parent container
  };

  return (
    <div
      className="cursor-pointer rounded bg-pal3 p-8 transition-all duration-300 ease-in-out hover:bg-[#ffe3f0] hover:shadow-2xl"
      onClick={handlePostClick}
    >
      {post.tags.length !== 0 ? (
        <div>
          <h2 className="mb-4 cursor-pointer font-display text-xl font-bold text-slate-800">
            {post.title}
          </h2>
          <div className="mb-3 flex flex-row justify-between">
            {post.tags.length > 0 && (
              <div className="flex items-center space-x-1">
                {post.tags.map((postTag) => (
                  <Badge
                    variant="outline"
                    key={postTag.tag.id}
                    className={`font-display text-[11px] font-semibold tracking-wider text-sky-950 shadow-sm ${
                      tagColourMap[postTag.tag.name] || "bg-gray-300"
                    } border-gray-300/30`}
                  >
                    {postTag.tag.name}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex flex-row gap-x-2">
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
                  <AvatarFallback className="">{authorName}</AvatarFallback>
                </Avatar>
                <p className="font-noto text-xs italic text-slate-800 transition-colors duration-200 ease-in-out hover:text-[#c84575]">
                  {authorName}
                </p>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-between">
          <h2 className="cursor-pointer font-display text-xl font-bold text-slate-800">
            {post.title}
          </h2>
          <div className="flex min-w-fit flex-row gap-x-2">
            <Link
              className="flex cursor-pointer flex-row items-center gap-x-2"
              href={
                authorName !== "Unknown author"
                  ? `/profile/${post.author?.email}`
                  : ""
              }
            >
              <Avatar className="h-5 w-5">
                <AvatarImage src={avatarImage} alt={authorName ?? undefined} />
                <AvatarFallback className="">{authorName}</AvatarFallback>
              </Avatar>
              <p className="font-noto text-xs italic text-slate-800 transition-colors duration-150 ease-in-out hover:text-white">
                {authorName}
              </p>
            </Link>
          </div>
        </div>
      )}
      <div
        className=" blog-content-post mt-4 max-h-16 cursor-pointer overflow-y-hidden font-noto text-sm text-slate-800"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />
      {post.published && (
        <>
          <div className="mt-4 flex items-end gap-x-4">
            <Like post={post} colorMode="dark" />
            <div className="flex flex-row items-center text-sm">
              <MessageCircle size={16} className="fill-none text-stone-800" />
              <span className="ml-1.5 text-stone-800">
                {post.Comment.length}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
