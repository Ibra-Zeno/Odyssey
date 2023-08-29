import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import Comment from "../../components/Comments";
import Like from "../../components/Like";

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
          select: { name: true, email: true },
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
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-sm mb-4">
          By {props?.author?.name || "Unknown author"}
        </p>
        <div dangerouslySetInnerHTML={{ __html: props.content }} />
        <Like postId={props.id} />
        <Comment postId={props.id} />
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button
            onClick={() => publishPost(props.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Publish
          </button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <>
            <button
              onClick={() => editPost(props.id)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Edit
            </button>
            <button
              onClick={() => deletePost(props.id)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mt-4 ml-4"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Post;
