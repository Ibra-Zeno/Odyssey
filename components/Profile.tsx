import Post from "./Post"; // Import your existing Post component
import { PostProps, LikeProps } from "./Post"; // Import your existing PostProps type

export type UserProps = {
  id: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  image: string | null;
  posts: PostProps[];
  Like: LikeProps[];
}

interface ProfileProps {
  user: UserProps;
  posts: PostProps[];
}

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
