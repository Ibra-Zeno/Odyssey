import Router from "next/router";
import Like from "./Like";
import CommentCount from "./CommentCount";
import Link from "next/link";

export type PostProps = {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
  comments: CommentProps[];
  likes: LikeProps[];
};

export type CommentProps = {
  id: string;
  content: string;
  createdAt: string; // You might want to format this as needed
  author: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type LikeProps = {
  id: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  post: PostProps;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";

  const handlePostClick = () => {
    Router.push("/p/[id]", `/p/${post.id}`);
  };

  return (
    <div className="text-black p-8">
      <h2 className="text-xl font-bold" onClick={handlePostClick}>
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
      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        onClick={handlePostClick}
      />
      {post.published && (
        <div className="flex items-center mt-4">
          <Like postId={post.id} />
          <CommentCount postId={post.id} />
        </div>
      )}
    </div>
  );
};

export default Post;
