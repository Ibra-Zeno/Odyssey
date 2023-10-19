import { useEffect, useState } from "react";
import { PostProps } from "@/utils/types";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

const Like: React.FC<{ post: PostProps }> = ({ post }) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

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
    getLikes();
    setLikesCount(post.Like.length);
  }, [postId, post.Like, session]);

  const toggleLike = async () => {
    if (!session || isUpdating) return;

    // Optimistically update the UI
    setIsUpdating(true);
    setLiked(!liked); // Toggle the like state
    setLikesCount((prevCount: number) =>
      liked ? prevCount - 1 : prevCount + 1,
    );

    try {
      // Make the API call
      if (liked) {
        // Unlike the post
        const response = await fetch(`/api/like/delete/${postId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          console.error("Error unliking the post.");
          // Revert the UI state if there's an error
          setLiked(true);
          setLikesCount((prevCount: number) => prevCount - 1);
        }
      } else {
        // Like the post
        await fetch(`/api/like/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });
        // No need to revert UI state on success
      }
    } catch (error) {
      console.error("Error:", error);
      // Revert the UI state if there's an error
      setLiked(!liked);
      setLikesCount((prevCount: number) =>
        liked ? prevCount - 1 : prevCount + 1,
      );
    }

    setIsUpdating(false);
  };

  return (
    <div className="flex items-center text-inherit">
      <button
        onClick={toggleLike}
        disabled={isUpdating} // Disable the button only when an action is in progress
        className={`mr-2 ${liked ? "text-red-500" : "text-gray-500"} ${
          session ? "cursor-pointer" : "cursor-not-allowed"
        }`}
      >
        {liked ? (
          <Heart className="fill-red-700 text-pal3" size={16} />
        ) : (
          <Heart className="fill-none text-pal3" size={16} />
        )}
        {/* <Heart
          className={`fill-${liked ? "red-600" : "none"} text-pal3`}
          size={16}
        /> */}
      </button>
      <p className="text-sm text-pal3">{likesCount}</p>
    </div>
  );
};

export default Like;
