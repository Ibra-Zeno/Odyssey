import Router from "next/router";
import Like from "./Like";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { PostProps } from "../utils/types";
import { Badge } from "@/components/ui/badge";
import { tagColourMap } from "../utils/tags";

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";

  const handlePostClick = () => {
    Router.push("/p/[id]", `/p/${post.id}`);
  };

  return (
    <div className="rounded p-8 text-black">
      <h2
        className="font-display text-xl font-semibold"
        onClick={handlePostClick}
      >
        {post.title}
      </h2>
      <Link
        href={
          authorName !== "Unknown author"
            ? `/profile/${post.author?.email}`
            : ""
        }
      >
        <small className="text-gray-800 hover:text-red-500">
          By {authorName}
        </small>
      </Link>
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
        className="max-h-16 overflow-y-hidden"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
        onClick={handlePostClick}
      />
      {post.published && (
        <>
          <div className="mt-4 flex items-center">
            <Like post={post} />
            <div className="flex flex-row text-sm">
              <MessageSquare />
              <span className="ml-2">{post.Comment.length}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
