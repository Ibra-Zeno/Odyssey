import prisma from "../../lib/prisma";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
            author: true,
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
                author: true,
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

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const authorName = user.name ? user.name : "Unknown author";
  const avatarImage = user.image || undefined;

  return (
    <Layout>
      <div>
        <div className=" flex flex-col items-center justify-center gap-x-2">
          <Avatar className="shadow-palText/10 h-28 w-28 shadow-xl">
            <AvatarImage
              src={avatarImage}
              className=""
              alt={authorName ?? undefined}
            />
            <AvatarFallback className="">{authorName}</AvatarFallback>
          </Avatar>
          <div className="mt-3 flex flex-col gap-y-1 text-center font-display ">
            <p className="text-palText text-lg font-bold">{authorName}</p>
            <p className="text-palText font-noto text-sm font-light italic tracking-wide">
              {user.email}
            </p>
          </div>
        </div>
        {/* Creating bio */}
        <div className="pb-8 pt-3">
          {!user.bio && isUser && (
            <div className="mb-8 flex justify-center">
              {!isEditingBio && (
                <Button
                  onClick={handleEditClick}
                  className=""
                  hidden={isEditingBio}
                >
                  Create Bio
                </Button>
              )}
              {isUser && isEditingBio && (
                <>
                  <div className="relative flex w-full max-w-4xl flex-col gap-y-3">
                    <div>
                      <Textarea
                        className="w-full"
                        typeof="text"
                        onChange={(e) => handleBioChange(e)}
                      />
                    </div>
                    <div className="flex flex-row justify-center gap-x-4">
                      <Button onClick={handleBioUpdate}>Save</Button>
                      <Button onClick={() => setIsEditingBio(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {/* Editing Bio */}
          {user.bio && (
            <div className="mx-auto flex w-full max-w-6xl flex-col justify-center">
              {/* Allow user to edit if it is their profile */}
              {isUser && isEditingBio ? (
                <div className="mb-8">
                  <Textarea
                    typeof="text"
                    onChange={(e) => handleBioChange(e)}
                    placeholder={user.bio}
                  />
                  <Button onClick={handleBioUpdate}>Save</Button>
                  <Button onClick={() => setIsEditingBio(false)}>Cancel</Button>
                </div>
              ) : (
                <>
                  <div className="text-palText mb-4 block  rounded bg-transparent p-3 text-center font-noto text-base">
                    {user.bio}
                  </div>
                  {isUser && (
                    <Button className="mx-auto w-fit" onClick={handleEditClick}>
                      Edit
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <Tabs
          defaultValue="posts"
          className="mx-auto max-w-6xl rounded bg-gradient-to-b from-slate-900 to-slate-800"
        >
          <TabsList className="grid w-full grid-cols-2 bg-transparent font-display text-lg font-semibold ">
            <TabsTrigger
              value="posts"
              className="  font-bold focus:bg-green-300"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger className="font-bold" value="likes">
              Likes
            </TabsTrigger>
          </TabsList>
          <TabsContent value="posts">
            <div className="flex flex-col gap-y-8 px-8">
              {user.posts.map((post) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="likes">
            <div className="flex flex-col gap-y-8 px-8">
              {user.Like &&
                user.Like.map((like) => (
                  <Post key={like.id} post={like.post} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default UserProfile;

// Implement log out on user profile page
