import prisma from "../../lib/prisma";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Layout from "../../components/Layout";
import Post from "../../components/Post"; // Import your Post component here
import { UserProps } from "../../utils/types"; // Import your User type here

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
            Comment: { select: { id: true } },
            Like: { select: { id: true } },
            author: {
              select: { name: true, email: true },
            },
            tags: {
              include: { tag: true },
            },
          },
        },
        Like: {
          include: {
            post: {
              include: {
                Comment: { select: { id: true } },
                Like: { select: { id: true } },
                author: {
                  select: { name: true, email: true },
                },
                tags: {
                  include: { tag: true },
                },
              },
            },
          }, // Include likes associated with the user
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
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(user.bio || "");
  const [activeTab, setActiveTab] = useState("posts");
  const { data: session } = useSession();
  const isUser = session?.user?.email === user.email;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleEditClick = () => {
    setIsEditingBio(true);
    setEditedBio(user.bio || "");
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedBio(event.target.value);
  };
  // Update the user's bio
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
          {/* Allow user to edit if it is their profile */}
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
          <button
            onClick={() => handleTabChange("posts")}
            className={`${
              activeTab === "posts"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            } rounded-md px-4 py-2 transition duration-300 ease-in-out`}
          >
            Posts
          </button>
          <button
            onClick={() => handleTabChange("likes")}
            className={`${
              activeTab === "likes"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            } rounded-md px-4 py-2 transition duration-300 ease-in-out`}
          >
            Likes
          </button>
          {activeTab === "posts" && (
            <>
              <h3>Posts by {user.name}</h3>
              {/* Mapping out posts by user */}
              {user.posts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </>
          )}
          {activeTab === "likes" && (
            <>
              <h3>Likes by {user.name}</h3>
              {user.Like &&
                user.Like.map((like) => (
                  <Post key={like.id} post={like.post} />
                ))}
            </>
          )}

          {/* 
          // Mapping out the user's likes
           */}
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;

// Implement log out on user profile page
