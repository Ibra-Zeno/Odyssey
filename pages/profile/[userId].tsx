import prisma from "../../lib/prisma";
import { GetServerSideProps } from "next";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import Head from "next/head";
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
    <>
      <Layout>
        <div>
          <div className="mx-auto my-6 mb-10 max-w-4xl sm:mt-0">
            <div className=" flex flex-col items-center justify-center gap-x-2">
              <Avatar className="h-20 w-20 shadow-xl shadow-palText/10 md:h-28 md:w-28">
                <AvatarImage
                  src={avatarImage}
                  className=""
                  alt={authorName ?? undefined}
                />
                <AvatarFallback className="">{authorName}</AvatarFallback>
              </Avatar>
              <div className="mt-3 flex flex-col gap-y-1 text-center font-display ">
                <p className="text-lg font-bold text-palText">{authorName}</p>
                <p className="font-noto text-xs font-light italic tracking-wide text-palText sm:text-sm">
                  {user.email}
                </p>
              </div>
            </div>
            {/* Creating bio */}
            <div className="pt-3">
              {!user.bio && isUser && (
                <div className="mb-8 flex justify-center">
                  {!isEditingBio && (
                    <Button
                      onClick={handleEditClick}
                      className="mt-6 w-full bg-pal4 font-display text-sm font-bold tracking-wide text-stone-50 shadow-lg hover:bg-pal6 sm:w-fit"
                      hidden={isEditingBio}
                    >
                      Create Bio
                    </Button>
                  )}
                  {isUser && isEditingBio && (
                    <>
                      <div className="relative mt-6 flex w-full max-w-4xl flex-col gap-y-3">
                        <div>
                          <Textarea
                            className="w-full"
                            typeof="text"
                            onChange={(e) => handleBioChange(e)}
                          />
                        </div>
                        <div className="mt-3 flex flex-row justify-center gap-x-4">
                          <Button
                            className="bg-pal4 font-display text-sm font-bold tracking-wide text-stone-50 shadow-lg hover:bg-pal6"
                            onClick={handleBioUpdate}
                          >
                            Save
                          </Button>
                          <Button
                            variant={"destructive"}
                            className="ml-4 cursor-pointer font-display text-sm font-bold tracking-wide shadow-lg"
                            onClick={() => setIsEditingBio(false)}
                          >
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
                    <div className="mb-8 mt-6">
                      <Textarea
                        typeof="text"
                        onChange={(e) => handleBioChange(e)}
                        placeholder={user.bio}
                      />
                      <div className="mt-4 flex w-full justify-center">
                        <Button
                          className="bg-pal4 px-6 font-display text-sm font-bold tracking-wide text-stone-50 shadow-lg hover:bg-pal6"
                          onClick={handleBioUpdate}
                        >
                          Save
                        </Button>
                        <Button
                          className="ml-4 cursor-pointer font-display text-sm font-bold tracking-wide shadow-lg"
                          onClick={() => setIsEditingBio(false)}
                          variant={"destructive"}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 block rounded  bg-transparent p-3 text-center font-noto text-sm text-palText md:text-base">
                        {user.bio}
                      </div>
                      {isUser && (
                        <Button
                          className="mx-auto w-full bg-pal4 font-display text-sm font-bold tracking-wide text-stone-50 shadow-lg hover:bg-pal6 sm:w-fit"
                          onClick={handleEditClick}
                        >
                          Edit Bio
                        </Button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          <Tabs
            defaultValue="posts"
            className="mx-auto max-w-6xl rounded bg-[#17242e] pb-4 shadow-2xl"
          >
            <TabsList className="grid w-full grid-cols-2 bg-[#4e5a6e] bg-transparent font-display text-lg font-semibold text-stone-50">
              <TabsTrigger
                value="posts"
                className=" py-3 font-bold selection:bg-[#4e5a6e]"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger className=" py-3 font-bold" value="likes">
                Likes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              <div className="my-8 flex flex-col gap-y-4 px-3 md:gap-y-6 md:px-8">
                {user.posts.map((post) => (
                  <Post key={post.id} post={post} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="likes">
              <div className="my-8 flex flex-col gap-y-5 px-3 md:gap-y-6 md:px-8">
                {user.Like &&
                  user.Like.map((like) => (
                    <Post key={like.id} post={like.post} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
      <Head>
        <title>{authorName}</title>
      </Head>
    </>
  );
};

export default UserProfile;

// Implement log out on user profile page
