import { useEffect, useState } from "react";
import { PostProps } from "@/utils/types";
import { useSession, getSession } from "next-auth/react";

// get serverSideProps for likes before render to show red or nah

const Like: React.FC<{ post: PostProps }> = ({ post }) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false); // Track whether a like/unlike action is in progress

  const postId = post.id;

  useEffect(() => {
    const getLikes = async () => {
      try {
        const response = await fetch(`/api/like/get/${postId}`);
        const likes = await response.json();

        if (session) {
          const userLiked = likes.some(
            (like: any) => like.author.email === session?.user?.email,
          );
          setLiked(userLiked);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };
    setLikesCount(post.Like.length);
  }, [post.Like, session]);

  const toggleLike = async () => {
    if (!session || isUpdating) return;

    setIsUpdating(true); // Start the update process

    setLiked(!liked); // Immediately update UI
    setLikesCount((prevCount: number) =>
      liked ? prevCount - 1 : prevCount + 1,
    ); // Update likes count

    if (liked) {
      // Unlike the post
      await fetch(`/api/like/delete/${postId}`, {
        method: "DELETE",
      });
    } else {
      // Like the post
      await fetch(`/api/like/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
    }

    setIsUpdating(false); // Finished updating
  };

  return (
    <div className="flex items-center">
      <button
        onClick={toggleLike}
        className={`mr-2 ${liked ? "text-red-500" : "text-gray-500"} ${
          session ? "cursor-pointer" : "cursor-not-allowed"
        }`}
      >
        {liked ? "❤️" : "🤍"}
      </button>
      <p className="text-sm">
        {likesCount} {likesCount === 1 ? "like" : "likes"}
      </p>
    </div>
  );
};

export default Like;
