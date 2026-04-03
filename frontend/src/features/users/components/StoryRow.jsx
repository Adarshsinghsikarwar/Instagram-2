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
        if (response.success) {
          setActiveStories(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      }
    };
    fetchStories();
  }, []);

  const handleAddStoryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert("Please upload an image or video file");
      return;
    }

    try {
      setIsUploading(true);
      const response = await uploadStory(file);
      if (response.success) {
        alert("Story uploaded successfully!");
        // Refresh stories
        const refreshResponse = await getStoryFeed();
        if (refreshResponse.success) setActiveStories(refreshResponse.data);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload story");
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

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-xl p-4 mb-6 relative overflow-hidden">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <div className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth">
        {/* Your Story */}
        <div
          className={`flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer ${
            isUploading ? "opacity-50 pointer-events-none" : ""
          }`}
          onClick={handleAddStoryClick}
        >
          <div className="relative p-[3px] rounded-full">
            <div className="w-16 h-16 rounded-full border border-zinc-200 overflow-hidden bg-zinc-100 flex items-center justify-center">
              {isUploading ? (
                <Loader className="animate-spin text-zinc-400" size={24} />
              ) : avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Your profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-zinc-400">
                  {initials}
                </span>
              )}
            </div>
            {!isUploading && (
              <div className="absolute bottom-0 right-0 p-1 bg-blue-500 rounded-full border-2 border-white">
                <Plus size={14} className="text-white" />
              </div>
            )}
          </div>
          <span className="text-xs text-zinc-500 truncate w-16 text-center">
            {isUploading ? "Uploading..." : "Your Story"}
          </span>
        </div>

        {/* Dynamic Stories */}
        {activeStories.map((story) => (
          <div
            key={story._id}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
            onClick={() => navigate(`/stories/${story.userId._id}`)}
          >
            <div className="p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 group-active:scale-95 transition-transform duration-200">
              <div className="p-0.5 bg-white rounded-full">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-100">
                  <img
                    src={story.userId.profilePicture || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop"}
                    alt={story.userId.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <span className="text-xs text-zinc-900 group-hover:text-zinc-500 transition-colors truncate w-16 text-center">
              {story.userId.username}
            </span>
          </div>
        ))}

        {/* Fallback to Mock if no active stories or for filler */}
        {activeStories.length < 5 && [1, 2, 3, 4, 5].map((i) => (
          <div
            key={`mock-${i}`}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group opacity-40 grayscale"
          >
            <div className="p-[3px] rounded-full border border-zinc-200">
              <div className="p-0.5 bg-white rounded-full">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-100" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom scrollbar hiding style logic can be added to index.css or simple tailwind class if supported */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `,
        }}
      />
    </div>
  );
};

export default StoryRow;
