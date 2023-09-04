import prisma from "../lib/prisma";
import { GetStaticProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  return {
    props: { feed },
    revalidate: 10,
  };
};

interface BlogProps {
  feed: PostProps[];
}

const Blog: React.FC<BlogProps> = ({ feed }) => {
  return (
    <Layout>
      <div className="page">
        <h1 className="text-2xl font-bold">Public Feed</h1>
        <main>
          {feed.map((post) => (
            <div
              key={post.id}
              className="post mt-8 bg-white transition-shadow hover:shadow-md"
            >
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Blog;
