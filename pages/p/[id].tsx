import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import Link from "next/link";
import { PostProps } from "../../utils/types";
import Comment from "../../components/Comments";
import Like from "../../components/Like";
import { tagColourMap } from "../../utils/tags";

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
        Like: { select: { id: true } },
        Comment: { select: { id: true } },
        author: {
          select: { name: true, email: true },
        },
        tags: {
          include: { tag: true },
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

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Authenticating...</div>;
  }

  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  const title = !props.published ? `${props.title} (Draft)` : props.title;

  const publishPost = async (id: string) => {
    await fetch(`/api/publish/${id}`, {
      method: "PUT",
    });
    await router.push("/");
  };

  async function deletePost(id: string): Promise<void> {
    await fetch(`/api/post/${id}`, {
      method: "DELETE",
    });
    router.push("/");
  }

  async function editPost(id: string): Promise<void> {
    router.push(`/edit/${props.id}`);
  }

  return (
    <Layout>
      <div className="page">
        <h2 className="mb-4 text-2xl font-bold">{title}</h2>
        <Link href={`/profile/${props.author?.email}`}>
          <p className="mb-4 text-sm hover:text-red-500">
            By {props?.author?.name || "Unknown author"}
          </p>
        </Link>
        {props.tags && (
          <div className="flex items-center space-x-2">
            <span className="font-semibold">Tags:</span>
            {props.tags.map((postTag) => (
              <span
                key={postTag.tag.id}
                className={`text-gray-800 shadow-md ${
                  tagColourMap[postTag.tag.name] || "bg-gray-300"
                } rounded-md px-2 py-1 text-sm`}
              >
                {postTag.tag.name}
              </span>
            ))}
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: props.content ?? "" }} />
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button
            onClick={() => publishPost(props.id)}
            className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
          >
            Publish
          </button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <>
            <button
              onClick={() => editPost(props.id)}
              className="mt-4 rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => deletePost(props.id)}
              className="ml-4 mt-4 rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
            >
              Delete
            </button>
          </>
        )}
        {props.published && (
          <>
            <Like post={props} />
            <Comment postId={props.id} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Post;
