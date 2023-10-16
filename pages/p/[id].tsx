import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { Button } from "../../components/ui/button";
import Layout from "../../components/Layout";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
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
        author: true,
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
  const authorName = props.author ? props.author.name : "Unknown author";
  const avatarImage = props?.author?.image || undefined;

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
      <div className="page mx-auto max-w-3xl">
        <h2 className="mb-6 font-display text-3xl font-bold">{title}</h2>
        <div className="mb-6 flex flex-row justify-between">
          {props.tags && (
            <div className="flex items-center space-x-2">
              {props.tags.map((postTag) => (
                <span
                  key={postTag.tag.id}
                  className={`font-display font-semibold tracking-wider text-gray-800 shadow-md ${
                    tagColourMap[postTag.tag.name] || "bg-gray-300"
                  } rounded-md px-2 py-1 text-xs`}
                >
                  {postTag.tag.name}
                </span>
              ))}
            </div>
          )}
          <Link
            className="flex flex-row items-center gap-x-2"
            href={
              authorName !== "Unknown author"
                ? `/profile/${props.author?.email}`
                : ""
            }
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarImage} alt={authorName ?? undefined} />
              <AvatarFallback className="">{authorName}</AvatarFallback>
            </Avatar>
            <p className="font-noto text-xs italic text-pal3">{authorName}</p>
          </Link>
        </div>

        {props.published && (
          <div className="mb-4 flex flex-row items-center gap-x-4 border-y border-y-pal3/25 py-3">
            <Like post={props} />
            <div className="flex flex-row items-end text-sm">
              <MessageCircle size={16} className="fill-none text-pal3" />
              <span className="ml-1 text-pal3">{props.Comment.length}</span>
            </div>
          </div>
        )}

        <div
          className="blog-content font-noto text-[20px] leading-[32px]"
          dangerouslySetInnerHTML={{ __html: props.content ?? "" }}
        />
        <div className="flex justify-between gap-x-4">
          {userHasValidSession && postBelongsToUser && (
            <>
              <div className="flex gap-x-4">
                {!props.published ? (
                  <Button
                    variant={"default"}
                    onClick={() => publishPost(props.id)}
                    className="bg-pal2 font-display font-medium tracking-wider text-palBg hover:bg-pal4"
                  >
                    Publish
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  onClick={() => editPost(props.id)}
                  className="border-2 border-[#3d607b]/90 font-display font-medium tracking-wider text-pal3 hover:bg-[#3d607b] hover:text-palBg"
                  variant={"ghost"}
                >
                  Edit
                </Button>
              </div>
              <div>
                <Button
                  onClick={() => deletePost(props.id)}
                  className="bg-[#B46060] font-display font-medium tracking-wider"
                  variant={"destructive"}
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
        {props.published && <Comment postId={props.id} />}
      </div>
    </Layout>
  );
};

export default Post;
