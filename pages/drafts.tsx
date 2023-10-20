import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { options } from "../pages/api/auth/[...nextauth]";
import Layout from "../components/Layout";
import Post from "../components/Post";
import Image from "next/image";
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
        <section className="flex h-full w-full flex-col items-center justify-center">
          <h1 className="mb-4 font-display text-2xl font-bold text-stone-300">
            My Drafts
          </h1>
          <div className="font-noto text-base">Have you signed in?</div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pointer-events-none absolute inset-0 -z-0">
        <Image
          src="/images/Moon.svg"
          alt="Hero"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        ></Image>
      </div>
      <div className="isolate mx-auto max-w-7xl">
        <h1 className="mb-4 font-display text-2xl font-bold text-stone-200">
          My Drafts
        </h1>
        <main>
          <section className="mx-auto flex flex-col gap-y-4">
            {drafts.map((post: any) => (
              <div key={post.id} className="post">
                <Post post={post} />
              </div>
            ))}
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default Drafts;
