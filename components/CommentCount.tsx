import { useEffect, useState } from "react";

const CommentCount: React.FC<{ postId: string }> = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comment/${postId}`);
      const data = await response.json();
      setComments(data);
      // console.log(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  return (
    <div className="flex items-center ml-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
      >
        <path
          fill="#2c9763"
          d="M6 14h12v-2H6v2Zm0-3h12V9H6v2Zm0-3h12V6H6v2Zm16 14l-4-4H4q-.825 0-1.413-.588T2 16V4q0-.825.588-1.413T4 2h16q.825 0 1.413.588T22 4v18ZM4 16V4v12Zm14.85 0L20 17.125V4H4v12h14.85Z"
        ></path>
      </svg>
      <p className="text-gray-500">
        {comments.length} {comments.length === 1 ? "comment" : "comments"}
      </p>
    </div>
  );
};

export default CommentCount;
