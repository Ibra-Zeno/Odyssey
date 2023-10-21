import prisma from "../../lib/prisma";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { Badge } from "../../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import Layout from "../../components/Layout";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { MessageCircle } from "lucide-react";
import { PostProps } from "../../utils/types";
import Comment from "../../components/Comments";
import Like from "../../components/Like";
import { tagColourMap } from "../../utils/tags";
import { Separator } from "@/components/ui/separator";

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
  const { toast } = useToast();
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
    toast({
      title: "Post published 🎉",
      description: "Your post has successfully been published.",
    });
    await router.push("/");
  };

  async function deletePost(id: string): Promise<void> {
    await fetch(`/api/post/${id}`, {
      method: "DELETE",
    });
    toast({
      title: "Post deleted successfully 💀",
      description: "Your post has been successfully eradicated.",
    });
    router.push("/");
  }

  async function editPost(id: string): Promise<void> {
    router.push(`/edit/${props.id}`);
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
      <div className="isolate mx-auto max-w-4xl rounded-md bg-pal3 p-8">
        <h2 className="mb-2 text-left font-display text-3xl font-bold text-slate-800">
          {title}
        </h2>
        {props.tags.length !== 0 ? (
          <div className="mb-6 mt-4 flex flex-row justify-between">
            {props.tags && (
              <div className="flex items-center space-x-1">
                {props.tags.map((postTag) => (
                  <Badge
                    key={postTag.tag.id}
                    className={`font-display font-semibold tracking-wider text-sky-950 shadow-sm ${
                      tagColourMap[postTag.tag.name] || "bg-gray-300"
                    } text-xs`}
                  >
                    {postTag.tag.name}
                  </Badge>
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
              <p className="font-noto text-xs italic text-slate-800">
                {authorName}
              </p>
            </Link>
          </div>
        ) : (
          <div className="mb-4 mt-4 flex w-full flex-row">
            <p className="mb-4 mr-0.5 text-right font-noto text-xs italic text-slate-800">
              Authored by
            </p>
            <Link
              className=""
              href={
                authorName !== "Unknown author"
                  ? `/profile/${props.author?.email}`
                  : ""
              }
            >
              <p className="font-noto text-xs italic text-slate-800 underline underline-offset-2 hover:text-pal6">
                {authorName}
              </p>
            </Link>
          </div>
        )}

        {props.published ? (
          <div className="mb-4 flex flex-row items-center gap-x-4 border-y border-y-pal5 py-3">
            <Like post={props} colorMode="dark" />
            <div className="flex flex-row items-end text-sm">
              <MessageCircle size={16} className="fill-none text-stone-800" />
              <span className="ml-1 text-stone-800">
                {props.Comment.length}
              </span>
            </div>
          </div>
        ) : (
          <Separator className="mx-auto mb-5 w-[90%] bg-stone-500/50" />
        )}

        <div
          className="blog-content font-noto text-[20px] leading-[32px] text-slate-800"
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
                    className="bg-pal4 px-6 font-display text-base font-bold tracking-wide text-stone-50 shadow-lg hover:bg-pal6"
                  >
                    Publish
                  </Button>
                ) : (
                  ""
                )}
                <Button
                  onClick={() => editPost(props.id)}
                  className="bg-pal5 px-5 font-display font-medium tracking-wider text-stone-50 hover:bg-pal5/90 hover:text-stone-200"
                  variant={"ghost"}
                >
                  Edit
                </Button>
              </div>
              <div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-red-400 px-5 font-display font-medium tracking-wider text-stone-50 hover:bg-red-600 hover:text-stone-200">
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-none bg-pal5 text-white shadow-none">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this post?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-stone-200">
                        This action will delete your post permanently.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-none bg-pal1 font-display text-stone-800 hover:bg-pal3 hover:text-stone-800">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deletePost(props.id)}
                        className="bg-red-500 font-display hover:bg-red-600 hover:text-stone-50"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
