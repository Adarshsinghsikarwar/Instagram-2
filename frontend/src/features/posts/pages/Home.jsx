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
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
            Welcome back
          </h1>
          <p className="text-gray-500 mb-6 text-sm">
            Log in to see photos and videos from people you follow.
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-2.5 rounded-lg bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors"
          >
            Log In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-4 py-6 w-full max-w-[470px] mx-auto">
      <StoryRow />
      {posts?.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center w-full">
          <p className="text-2xl mb-2">📷</p>
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            Your feed is empty
          </h2>
          <p className="text-sm text-gray-500">
            Follow people to see their photos and videos here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;

