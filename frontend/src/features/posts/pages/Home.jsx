import { useEffect } from "react";
import PostCard from "../components/PostCard";
import { usePost } from "../hooks/usePost";
import { useSelector } from "react-redux";
import StoryRow from "../../users/components/StoryRow";

const Home = () => {
  const { handleGetPosts } = usePost();
  const posts = useSelector((state) => state.posts?.posts);
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    handleGetPosts();
  }, []);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Welcome</h1>
        <p className="mt-2 text-zinc-600">
          Please log in to see your personalized feed.
        </p>
        <a
          href="/login"
          className="inline-block mt-4 px-4 py-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-700 transition-colors"
        >
          Go to Login
        </a>
      </div>
    );
  }

  if (!posts?.length) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-semibold text-zinc-900">Home Feed</h1>
        <p className="mt-2 text-zinc-600">
          No posts available yet. Follow people or create your first post.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center pb-20 md:pb-8 pt-4 md:pt-8">
      <div className="max-w-2xl mx-auto p-4 flex flex-col items-center w-full">
        <StoryRow />
        {posts?.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default Home;
