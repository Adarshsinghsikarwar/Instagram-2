import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Grid3X3, Bookmark, Settings, Camera } from "lucide-react";
import PostCard from "../../posts/components/PostCard";
import { useUser } from "../hooks/useUser";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const { handleGetMyProfileData } = useUser();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    const fetchProfileData = async () => {
      const response = await handleGetMyProfileData();
      if (response?.success) {
        setProfile(response.profile);
        setPosts(response.posts ?? []);
      }
      setLoading(false);
    };
    fetchProfileData();
  }, [handleGetMyProfileData]);

  const stats = profile || {
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
  };

  const avatarUrl = user?.profilePicture || user?.prfilePicture;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[935px] mx-auto px-4 py-8">
      {/* ── Profile Header ── */}
      <header className="flex items-start gap-8 md:gap-20 mb-10 md:mb-12 px-4 md:px-0">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 md:w-[150px] md:h-[150px] rounded-full overflow-hidden border border-gray-200 bg-gray-100">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user?.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl md:text-5xl font-light text-gray-300">
                {user?.fullname?.[0] || "U"}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 pt-1">
          {/* Row 1: Username + buttons */}
          <div className="flex flex-wrap items-center gap-3 md:gap-5 mb-5">
            <h1 className="text-xl font-normal text-gray-900">
              {user?.username}
            </h1>
            <button className="px-5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-900 transition-colors">
              Edit profile
            </button>
            <button className="px-5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-900 transition-colors">
              View archive
            </button>
            <button className="text-gray-900 hover:text-gray-500 transition-colors ml-1">
              <Settings size={24} strokeWidth={2} />
            </button>
          </div>

          {/* Row 2: Stats */}
          <div className="hidden md:flex gap-10 mb-5">
            <span className="text-base">
              <span className="font-semibold">{stats.postsCount}</span>{" "}
              <span className="text-gray-900">posts</span>
            </span>
            <button className="text-base">
              <span className="font-semibold">{stats.followersCount}</span>{" "}
              <span className="text-gray-900">followers</span>
            </button>
            <button className="text-base">
              <span className="font-semibold">{stats.followingCount}</span>{" "}
              <span className="text-gray-900">following</span>
            </button>
          </div>

          {/* Row 3: Bio */}
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-900 leading-snug">
              {user?.fullname}
            </p>
          </div>
        </div>
      </header>

      {/* Mobile-only: Bio below header */}
      <div className="md:hidden px-4 mb-4 -mt-4">
        <p className="text-sm font-semibold text-gray-900">{user?.fullname}</p>
      </div>

      {/* Mobile-only: Stats row */}
      <div className="md:hidden flex border-t border-gray-200 py-3 mb-0">
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-gray-900">{stats.postsCount}</p>
          <p className="text-xs text-gray-400">posts</p>
        </div>
        <div className="flex-1 text-center border-x border-gray-200">
          <p className="text-sm font-semibold text-gray-900">{stats.followersCount}</p>
          <p className="text-xs text-gray-400">followers</p>
        </div>
        <div className="flex-1 text-center">
          <p className="text-sm font-semibold text-gray-900">{stats.followingCount}</p>
          <p className="text-xs text-gray-400">following</p>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="flex border-t border-gray-200">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 md:flex-initial flex items-center justify-center gap-2 py-3 md:px-6 md:mx-auto text-xs uppercase tracking-widest font-semibold transition-colors border-t -mt-px ${
            activeTab === "posts"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <Grid3X3 size={12} />
          <span className="hidden md:inline">Posts</span>
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`flex-1 md:flex-initial flex items-center justify-center gap-2 py-3 md:px-6 md:mx-auto text-xs uppercase tracking-widest font-semibold transition-colors border-t -mt-px ${
            activeTab === "saved"
              ? "border-gray-900 text-gray-900"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <Bookmark size={12} />
          <span className="hidden md:inline">Saved</span>
        </button>
      </div>

      {/* ── Content ── */}
      <section className="py-6">
        {activeTab === "posts" && (
          <>
            {!posts.length ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full border-2 border-gray-900 flex items-center justify-center mb-4">
                  <Camera size={32} className="text-gray-900" strokeWidth={1.5} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Share Photos
                </h2>
                <p className="text-sm text-gray-400 text-center max-w-xs">
                  When you share photos, they will appear on your profile.
                </p>
                <a
                  href="/create"
                  className="mt-4 text-sm font-bold text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Share your first photo
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center max-w-[470px] mx-auto">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "saved" && (
          <div className="flex flex-col items-center justify-center py-16">
            <Bookmark size={32} className="text-gray-300 mb-4" strokeWidth={1.5} />
            <p className="text-sm text-gray-400">
              Only you can see what you've saved.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Profile;
