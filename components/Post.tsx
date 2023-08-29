import Router from "next/router";
import Like from "./Like";

export type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
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
