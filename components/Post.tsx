import Router from "next/router";
import ReactMarkdown from "react-markdown";

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
      <ReactMarkdown className="prose">{post.content}</ReactMarkdown>
    </div>
  );
};

export default Post;
