import { Plus, Loader } from "lucide-react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { uploadStory, getStoryFeed } from "../services/story.api";

const StoryRow = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeStories, setActiveStories] = useState([]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await getStoryFeed();
        if (response.success) setActiveStories(response.data);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      }
    };
    fetchStories();
  }, []);

  const handleAddStoryClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert("Please upload an image or video file");
      return;
    }
    try {
      setIsUploading(true);
      const response = await uploadStory(file);
      if (response.success) {
        const refreshResponse = await getStoryFeed();
        if (refreshResponse.success) setActiveStories(refreshResponse.data);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const avatarUrl = user?.profilePicture || user?.prfilePicture;
  const initials =
    user?.fullname
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const hasStories = activeStories.length > 0;

  // ── No stories yet: render a simple static div ──
  if (!hasStories) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-xl mb-5 flex items-center gap-4 px-4 py-3">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />
        {/* Avatar / Add button on the left */}
        <button
          onClick={handleAddStoryClick}
          disabled={isUploading}
          className="relative flex-shrink-0 disabled:opacity-50"
        >
          <div className="w-14 h-14 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
            {isUploading ? (
              <Loader size={20} className="animate-spin text-gray-400" />
            ) : avatarUrl ? (
              <img src={avatarUrl} alt="Your story" className="w-full h-full object-cover" />
            ) : (
              <span className="text-base font-semibold text-gray-500">{initials}</span>
            )}
          </div>
          {!isUploading && (
            <span className="absolute bottom-0 right-0 w-[18px] h-[18px] bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
              <Plus size={10} className="text-white" strokeWidth={3} />
            </span>
          )}
        </button>

        {/* Text hint */}
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-none">
            {user?.username || "Your story"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Add to your story
          </p>
        </div>
      </div>
    );
  }

  // ── Stories exist: scrollable row ──
  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl mb-5 overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <div className="flex gap-4 overflow-x-auto px-4 py-3 no-scrollbar">
        {/* Your Story bubble */}
        <button
          onClick={handleAddStoryClick}
          disabled={isUploading}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 disabled:opacity-50"
        >
          <div className="relative">
            <div className="w-[62px] h-[62px] rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
              {isUploading ? (
                <Loader size={20} className="animate-spin text-gray-400" />
              ) : avatarUrl ? (
                <img src={avatarUrl} alt="Your story" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-gray-500">{initials}</span>
              )}
            </div>
            {!isUploading && (
              <span className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                <Plus size={11} className="text-white" strokeWidth={3} />
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-gray-600 truncate w-[62px] text-center">
            Your story
          </span>
        </button>

        {/* Friend Stories */}
        {activeStories.map((story) => (
          <button
            key={story._id}
            onClick={() => navigate(`/stories/${story.userId._id}`)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div className="p-[2.5px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
              <div className="p-[2px] bg-white rounded-full">
                <div className="w-[58px] h-[58px] rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={
                      story.userId.profilePicture ||
                      `https://ui-avatars.com/api/?name=${story.userId.username}&background=f3f4f6&color=374151`
                    }
                    alt={story.userId.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <span className="text-[11px] font-medium text-gray-800 truncate w-[62px] text-center">
              {story.userId.username}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StoryRow;
