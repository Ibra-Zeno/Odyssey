import Router from "next/router";
import Like from "./Like";

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
  createdAt: string; // You might want to format this as needed
  author: {
    id: string;
    name: string;
    email: string;
  };
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";

  return (
    <div
      onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}
      className="text-black p-8"
    >
      <h2 className="text-xl font-bold">{post.title}</h2>
      <small className="text-gray-800">By {authorName}</small>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <Like postId={post.id} />
    </div>
  );
};

export default Post;
