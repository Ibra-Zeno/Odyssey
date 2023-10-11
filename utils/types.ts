export type PostProps = {
  id: string;
  title: string;
  author: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  content: string | null;
  published: boolean;
  comments: CommentProps[];
  Comment: any;
  likes: LikeProps[];
  tags: PostTag[]; // Modified to use TagProps
  Like?: any;
};
export type PostTag = {
  postId: string;
  tagId: string;
  post: PostProps;
  tag: TagProps;
};

export type CommentProps = {
  id: string;
  content: string;
  createdAt: string; // You might want to format this as needed
  author: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
};

export type LikeProps = {
  id: string;
  author: {
    id: string;
    name: string | null;
    email: string | null;
  };
  post: PostProps;
};

export type TagProps = {
  id: string;
  name: string;
  posts: PostTag[]; // Modified to use PostProps[]
};

export type UserProps = {
  id: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  image: string | null;
  posts: PostProps[];
  Like: LikeProps[];
};

export type ProfileProps = {
  user: UserProps;
  posts: PostProps[];
};

export type BlogProps = {
  feed: PostProps[];
  tagPosts: TagProps[];
  topLikedPostsResponse: PostProps[];
};
export type DraftsProps = {
  drafts: PostProps[];
};

export type QuillEditorProps = {
  content: string;
  setContent: (content: string) => void;
};
