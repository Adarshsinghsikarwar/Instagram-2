import { useState, useRef } from "react";
import VideoPlayer from "./VideoPlayer";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";

const PostCard = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const idx = Math.round(e.target.scrollLeft / e.target.offsetWidth);
    if (idx !== activeSlide) setActiveSlide(idx);
  };

  return (
    <article className="bg-white border border-gray-200 rounded-xl mb-6 overflow-hidden w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Avatar with gradient ring */}
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
            <div className="p-[2px] bg-white rounded-full">
              <img
                src={post.author.profilePicture}
                alt={post.author.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-none">
              {post.author.username}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-900 transition-colors p-1">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Media */}
      <div className="w-full relative bg-gray-100">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory aspect-square [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {post.media.map((item, index) => (
            <div key={item._id} className="w-full flex-none snap-center">
              {item.media_type === "video" ? (
                <VideoPlayer url={item.url} />
              ) : (
                <img
                  src={item.url}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {post.media.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {post.media.map((_, i) => (
              <span
                key={i}
                className={`block rounded-full transition-all duration-300 ${
                  i === activeSlide
                    ? "w-2 h-2 bg-white"
                    : "w-1.5 h-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pt-3 pb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`transition-all active:scale-90 ${liked ? "text-red-500" : "text-gray-900 hover:text-gray-500"}`}
            >
              <Heart
                size={24}
                strokeWidth={2}
                fill={liked ? "currentColor" : "none"}
              />
            </button>
            <button className="text-gray-900 hover:text-gray-500 transition-colors active:scale-90">
              <MessageCircle size={24} strokeWidth={2} />
            </button>
            <button className="text-gray-900 hover:text-gray-500 transition-colors active:scale-90">
              <Send size={24} strokeWidth={2} />
            </button>
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className={`transition-all active:scale-90 ${saved ? "text-gray-900" : "text-gray-900 hover:text-gray-500"}`}
          >
            <Bookmark
              size={24}
              strokeWidth={2}
              fill={saved ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Caption */}
        <div className="text-sm text-gray-900 leading-snug">
          <span className="font-semibold mr-1.5">{post.author.username}</span>
          <span className="text-gray-700">{post.caption}</span>
        </div>

        {/* Date */}
        <p className="text-[11px] text-gray-400 mt-2 uppercase tracking-wide font-medium">
          {new Date(post.createdAt).toLocaleDateString(undefined, {
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </article>
  );
};

export default PostCard;
