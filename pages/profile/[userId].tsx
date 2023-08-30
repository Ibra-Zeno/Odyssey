import prisma from "../../lib/prisma";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Post from "../../components/Post"; // Import your Post component here
import { UserProps } from "../../components/Profile"; // Import your User type here

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  if (!params || typeof params.userId !== "string") {
    return {
      notFound: true,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: String(params.userId),
      },
      include: {
        posts: {
          include: {
            author: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    if (!user) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        user,
      },
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      props: {
        user: null,
      },
    };
  }
};

const UserProfile: React.FC<{ user: UserProps }> = ({ user }) => {
  const router = useRouter();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(user.bio || "");
  const { data: session } = useSession();
  const isUser = session?.user?.email === user.email;

  const handleEditClick = () => {
    setIsEditingBio(true);
    setEditedBio(user.bio || "");
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedBio(event.target.value);
  };

  const handleBioUpdate = async () => {
    try {
      await fetch(`/api/user/updateBio`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bio: editedBio }),
      });
      // You can add a success message or navigation logic here
      setIsEditingBio(false);
      user.bio = editedBio;
    } catch (error) {
      console.error("Error updating bio:", error);
    }
  };

  return (
    <Layout>
      <div>
        <h2>{user.name}</h2>
        <p>
          <strong>Bio:</strong>{" "}
          {isUser && isEditingBio ? (
            <>
              <input type="text" value={editedBio} onChange={handleBioChange} />
              <button onClick={handleBioUpdate}>Save</button>
            </>
          ) : (
            <>
              {user.bio}
              {isUser && <button onClick={handleEditClick}>Edit</button>}
            </>
          )}
        </p>
        <div>
          <h3>Posts by {user.name}</h3>
          {user.posts.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
