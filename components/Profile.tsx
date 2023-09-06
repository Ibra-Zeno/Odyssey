import Post from "./Post"; // Import your existing Post component
import { ProfileProps } from "../utils/types"; // Import your existing PostProps type

const Profile: React.FC<ProfileProps> = ({ user, posts }) => {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      {/* Display user's profile picture here */}
      <div>
        <h3>Posts by {user.name}</h3>
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
