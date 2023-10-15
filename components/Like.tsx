import { useEffect, useState } from "react";
import { PostProps } from "@/utils/types";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";

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
    setIsUpdating(true);

    if (liked) {
      // Unlike the post
      try {
        const response = await fetch(`/api/like/delete/${postId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setLiked(false);
          setLikesCount((prevCount: number) => prevCount - 1);
        } else {
          console.error("Error unliking the post.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      // Like the post
      try {
        await fetch(`/api/like/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });
        setLiked(true);
        setLikesCount((prevCount: number) => prevCount + 1);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    setIsUpdating(false);
  };

  return (
    <div className="flex items-center text-inherit">
      <button
        onClick={toggleLike}
        className={`mr-2 ${liked ? "text-red-500" : "text-gray-500"} ${
          session ? "cursor-pointer" : "cursor-not-allowed"
        }`}
      >
        <Heart
          className={`${liked ? "fill-red-600" : "fill-none"} text-pal3`}
          size={16}
        />
      </button>
      <p className="text-sm text-pal3">{likesCount}</p>
    </div>
  );
};

export default Like;
