import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { options } from "../pages/api/auth/[...nextauth]";
import Layout from "../components/Layout";
import Post from "../components/Post";
import prisma from "../lib/prisma";
import { DraftsProps } from "../utils/types";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, options);

  if (!session) {
    context.res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
    where: {
      author: { email: session?.user?.email },
      published: false,
    },
    include: {
      author: true,
      tags: {
        include: { tag: true },
      },
    },
  });

  return {
    props: { drafts },
  };
}

const Drafts: React.FC<DraftsProps> = ({ drafts }) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1 className="mb-4 text-2xl font-bold">My Drafts</h1>
        <div>Have you signed in?</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1 className="mb-4 text-2xl font-bold">My Drafts</h1>
        <main>
          {drafts.map((post: any) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Drafts;
