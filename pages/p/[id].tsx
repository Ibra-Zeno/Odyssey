import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import ReactMarkdown from "react-markdown";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = {
    id: "1",
    title: "My first blog post",
    content: "This is my very first blog post.",
    published: false,
    author: {
      name: "Zeno Rocha",
      email: "paradox@apostle.y",
    },
  };
  return {
    props: post,
  };
};

const Post: React.FC<PostProps> = ({ title, author, content, published }) => {
  const displayTitle = published ? title : `${title} (Draft)`;
  const authorName = author?.name || "Unknown author";

  return (
    <Layout>
      <div className="bg-white p-8">
        <h2 className="text-xl font-bold">{displayTitle}</h2>
        <p className="text-gray-600">By {authorName}</p>
        <ReactMarkdown className="prose">{content}</ReactMarkdown>
      </div>
    </Layout>
  );
};

export default Post;
