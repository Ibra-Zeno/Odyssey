import prisma from "../../lib/prisma";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import ReactMarkdown from "react-markdown";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params || typeof params.id !== "string") {
    return {
      notFound: true,
    };
  }

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: String(params?.id),
      },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    if (!post) {
      return {
        notFound: true,
      };
    }

    return {
      props: post,
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return {
      props: {
        post: null,
      },
    };
  }
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
