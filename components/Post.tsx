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
      className="relative cursor-pointer rounded bg-pal3/90 px-4 py-6 transition-all duration-300 ease-in-out hover:bg-[#ffe3f0]  hover:shadow-2xl md:p-8"
      onClick={handlePostClick}
    >
      {post.tags.length !== 0 ? (
        <div>
          <h2 className="mb-2 cursor-pointer font-display text-base font-bold text-slate-800 sm:mb-4 sm:text-xl">
            {post.title}
          </h2>
          <div className="mb-1.5 flex flex-row  justify-between sm:mb-3">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
                {post.tags.map((postTag) => (
                  <Badge
                    variant="outline"
                    key={postTag.tag.id}
                    className={`font-display text-[10px] font-semibold tracking-wider text-sky-950 shadow-sm sm:text-[11px] ${
                      tagColourMap[postTag.tag.name] || "bg-gray-300"
                    } border-gray-300/30`}
                  >
                    {postTag.tag.name}
                  </Badge>
                ))}
              </div>
            )}
            <div className="hidden flex-row gap-x-2 sm:flex">
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
                <p className="font-noto text-[10px] italic text-slate-800 transition-colors duration-150 ease-in-out hover:text-[#c84575] sm:text-xs">
                  {authorName}
                </p>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-row items-center justify-between">
          <h2 className="mb-2 cursor-pointer font-display text-base font-bold text-slate-800 sm:mb-4 sm:text-xl">
            {post.title}
          </h2>
          <div className="flex min-w-fit flex-row gap-x-2">
            <Link
              className="hidden cursor-pointer flex-row items-center gap-x-2 sm:flex"
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
              <p className="font-noto text-[10px] italic text-slate-800 transition-colors duration-150 ease-in-out hover:text-[#c84575] sm:text-xs">
                {authorName}
              </p>
            </Link>
          </div>
        </div>
      )}
      <div
        className=" blog-content-post mt-4 h-fit max-h-10 cursor-pointer overflow-y-hidden font-noto text-xs text-slate-800 sm:block sm:max-h-16 sm:text-sm"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />
      {post.published && (
        <div className="mt-4 flex flex-row items-center justify-between sm:justify-start">
          <div className="flex min-w-fit flex-row gap-x-2 sm:hidden">
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
              <p className="font-noto text-[10px] italic text-slate-800 transition-colors duration-150 ease-in-out hover:text-[#c84575] sm:text-xs">
                {authorName}
              </p>
            </Link>
          </div>
          <div className=" flex items-end gap-x-4">
            <Like post={post} colorMode="dark" />
            <div className="flex flex-row items-center text-sm">
              <MessageCircle size={16} className="fill-none text-stone-800" />
              <span className="ml-1.5 text-stone-800">
                {post.Comment.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
