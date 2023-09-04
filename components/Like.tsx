import { useEffect, useState } from "react";
import { useSession, getSession } from "next-auth/react";

// get serverSideProps for likes before render to show red or nah

const Like: React.FC<{ postId: string }> = ({ postId }) => {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false); // Track whether a like/unlike action is in progress

  /*   async function getStaticProps(context) {
    const session = await getSession(context);
    getLikes();
  }
  Something to get the likes before a render? */

  useEffect(() => {
    getLikes();
  }, [liked]);

  const getLikes = async () => {
    try {
      const response = await fetch(`/api/like/get/${postId}`);
      const likes = await response.json();
      setLikesCount(likes.length);

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

  const toggleLike = async () => {
    if (!session || isUpdating) return;

    setIsUpdating(true); // Start the update process

    setLiked(!liked); // Immediately update UI
    setLikesCount((prevCount) => (liked ? prevCount - 1 : prevCount + 1)); // Update likes count

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
    <div className="mt-4 flex items-center">
      <button
        onClick={toggleLike}
        className={`mr-2 ${liked ? "text-red-500" : "text-gray-500"} ${
          session ? "cursor-pointer" : "cursor-not-allowed"
        }`}
      >
        {liked ? "❤️" : "🤍"}
      </button>
      <p>
        {likesCount} {likesCount === 1 ? "like" : "likes"}
      </p>
      {/*       {session ? (
        <p className="ml-10">
          {liked ? "You liked this post" : "Like this post"}
        </p>
      ) : (
        <p>Please sign in to like this post.</p>
      )} */}
    </div>
  );
};

export default Like;
