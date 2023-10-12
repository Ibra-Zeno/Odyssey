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
    <div className="rounded p-8">
      <h2
        className="font-display text-xl font-semibold"
        onClick={handlePostClick}
      >
        {post.title}
      </h2>
      <div className="mt-4 flex flex-row gap-x-2">
        <Link
          className="flex flex-row gap-x-2"
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
          <p className="font-noto text-xs">{authorName}</p>
        </Link>
      </div>
      <div className="mt-4 flex items-center">
        <div className="flex items-center space-x-2">
          {post.tags.length > 0 && (
            <div className="flex items-center space-x-2">
              {post.tags.map((postTag) => (
                <Badge
                  variant="outline"
                  key={postTag.tag.id}
                  className={`font-display tracking-wide text-gray-800 shadow-md ${
                    tagColourMap[postTag.tag.name] || "bg-gray-300"
                  } border-gray-300/30`}
                >
                  {postTag.tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className="max-h-16 overflow-y-hidden font-noto text-sm"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
        onClick={handlePostClick}
      />
      {post.published && (
        <>
          <div className="mt-4 flex items-end">
            <Like post={post} />
            <div className="flex flex-row items-end text-sm">
              <MessageCircle size={16} className="fill-none" />
              <span className="ml-1">{post.Comment.length}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
