import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";

const Comment: React.FC<{ postId: string }> = ({ postId }) => {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comment/${postId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleDeleteClick = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comment/delete/${commentId}`, {
        method: "DELETE",
      });

      if (response.status === 200) {
        // Refresh comments after deletion
        fetchComments();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const submitComment = async () => {
    if (!content) return;

    await fetch(`/api/comment/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, content }),
    });

    setContent("");
    fetchComments(); // Fetch comments again after submitting
  };

  return (
    <div className="my-4 border-t-2 border-t-stone-600/10 pt-8">
      {session ? (
        <div className="mb-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="w-full rounded bg-stone-100 p-2 shadow-sm"
          />
          <Button
            onClick={submitComment}
            className="mt-2.5 h-fit w-full rounded bg-pal5 px-4 py-2.5 font-display text-xs font-medium tracking-wide text-stone-100 shadow-md hover:bg-pal5/80 sm:w-fit"
          >
            Submit
          </Button>
        </div>
      ) : (
        <p className="text-center font-display text-xs font-medium text-stone-700 md:text-left md:text-sm">
          Please sign in to leave a comment.
        </p>
      )}
      <div className="mt-4">
        <h3 className="mb-3  pl-0.5 font-display text-sm font-bold text-stone-700 md:text-base">
          Comments
        </h3>
        <section className="flex flex-col gap-y-1">
          {comments.length > 0 ? (
            comments.map((comment: any) => (
              <div
                key={comment.id}
                className="relative mb-2 flex flex-row items-start justify-between gap-x-4 rounded border-b-2 border-stone-600/5 p-2 shadow-sm"
              >
                <div className="flex flex-col">
                  <p className=" text-justify font-noto text-xs text-stone-700 md:text-sm">
                    {comment.content}
                  </p>
                  {comment.author && (
                    <Link
                      className="mt-2 flex cursor-pointer flex-row items-center gap-x-2"
                      href={
                        comment.author.name !== "Unknown author"
                          ? `/profile/${comment.author?.email}`
                          : ""
                      }
                    >
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={comment.author.image}
                          alt={comment.author.name ?? undefined}
                        />
                        <AvatarFallback className="">
                          {comment.author.name}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-noto text-[10px] italic text-stone-600 transition-colors duration-200 ease-in-out hover:text-stone-800 sm:text-xs">
                        {comment.author.name}
                      </p>
                    </Link>
                  )}
                </div>
                {session?.user?.email === comment.author?.email && (
                  <Button
                    onClick={() => handleDeleteClick(comment.id)}
                    className="mr-2 h-fit cursor-pointer bg-transparent p-0 font-display text-xs font-medium tracking-wide text-stone-100 hover:bg-transparent "
                  >
                    <XCircle
                      strokeWidth={1.3}
                      size={24}
                      className="fill-red-400 transition-colors duration-150 ease-in-out hover:fill-red-600"
                    />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="font-display text-xs font-medium text-stone-700 md:text-sm">
              No comments yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Comment;
