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

  return (
    <div className="rounded bg-[#bea5aa] p-8">
      <div className="mb-2 mt-4 flex items-center">
        <div className="flex items-center space-x-2"></div>
      </div>
      <h2
        className="mb-4 cursor-pointer font-display text-xl font-semibold text-slate-800"
        onClick={handlePostClick}
      >
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
          >
            <Avatar className="h-5 w-5">
              <AvatarImage src={avatarImage} alt={authorName ?? undefined} />
              <AvatarFallback className="">{authorName}</AvatarFallback>
            </Avatar>
            <p className="italic#bea5aat-pal3 font-noto text-xs">
              {authorName}
            </p>
          </Link>
        </div>
      </div>
      <div
        className=" blog-content-post mt-4 max-h-16 cursor-pointer overflow-y-hidden font-noto text-sm text-slate-800 "
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
        onClick={handlePostClick}
      />
      {post.published && (
        <>
          <div className="mt-4 flex items-end gap-x-4">
            <Like post={post} />
            <div className="flex flex-row items-end text-sm">
              <MessageCircle size={16} className="fill-none text-pal3" />
              <span className="ml-1 text-pal3">{post.Comment.length}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
