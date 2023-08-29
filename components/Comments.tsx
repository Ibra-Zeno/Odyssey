import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

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
      console.log(comments);
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
    <div className="my-4">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>
      {session ? (
        <div className="mb-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-2 border rounded"
          />
          <button
            onClick={submitComment}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      ) : (
        <p>Please sign in to leave a comment.</p>
      )}
      <div className="mt-4">
        {comments.length > 0 ? (
          comments.map((comment: any) => (
            <div key={comment.id} className="border p-2 mb-2 relative">
              <p>{comment.content}</p>
              {comment.author && <small>By {comment.author.name}</small>}
              {session?.user?.email === comment.author?.email && (
                <button
                  onClick={() => handleDeleteClick(comment.id)}
                  className="text-red-500 absolute right-10 top-6 hover:underline cursor-pointer ml-4"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default Comment;
