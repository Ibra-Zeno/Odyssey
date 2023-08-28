import { getSession, useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { options } from "../pages/api/auth/[...nextauth]";
import Layout from "../components/Layout";
import Post from "../components/Post";
import prisma from "../lib/prisma";

export async function getServerSideProps(context) {
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
      author: {
        select: { name: true },
      },
    },
  });

  return {
    props: { drafts },
  };
}

export default function Drafts({ drafts }) {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1 className="text-2xl font-bold mb-4">My Drafts</h1>
        <div>Have you signed in?</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1 className="text-2xl font-bold mb-4">My Drafts</h1>
        <main>
          {drafts.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
}
