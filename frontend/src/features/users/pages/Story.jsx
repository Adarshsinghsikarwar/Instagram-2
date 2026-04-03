import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Send,
  MoreHorizontal,
} from "lucide-react";

const Story = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [currentSegment, setCurrentSegment] = useState(0);
  const [progress, setProgress] = useState(0);

  const segments = [
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1502759683299-cdcc69741a7f?w=1200&h=1800&fit=crop",
      duration: 5000,
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1548013146-72479768bbaa?w=1200&h=1800&fit=crop",
      duration: 5000,
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=1800&fit=crop",
      duration: 5000,
    },
  ];

  useEffect(() => {
    const duration = segments[currentSegment].duration;
    const interval = 50; // Update every 50ms
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentSegment]);

  const handleNext = () => {
    if (currentSegment < segments.length - 1) {
      setCurrentSegment((prev) => prev + 1);
      setProgress(0);
    } else {
      navigate(-1); // Go back when finished
    }
  };

  const handlePrev = () => {
    if (currentSegment > 0) {
      setCurrentSegment((prev) => prev - 1);
      setProgress(0);
    } else {
      navigate(-1); // Go back if at start
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-black flex items-center justify-center overflow-hidden">
      {/* Background Blur Overlay (Premium Feel) */}
      <div
        className="absolute inset-0 opacity-40 blur-2xl scale-110 pointer-events-none"
        style={{
          backgroundImage: `url(${segments[currentSegment].url})`,
          backgroundSize: "cover",
        }}
      ></div>

      {/* Story Container */}
      <div className="relative w-full max-w-md aspect-[9/16] bg-zinc-900 rounded-none md:rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Progress Bars */}
        <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
          {segments.map((_, index) => (
            <div
              key={index}
              className="h-0.5 flex-1 bg-white/30 rounded-full overflow-hidden"
            >
              <div
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{
                  width:
                    index === currentSegment
                      ? `${progress}%`
                      : index < currentSegment
                      ? "100%"
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header (User Info) */}
        <div className="absolute top-8 left-4 right-4 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-white/50 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop"
                alt="User"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white drop-shadow-md">
                alex_travels
              </span>
              <span className="text-xs text-white/70 drop-shadow-md">4h</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-white hover:opacity-75 transition-opacity">
              <MoreHorizontal size={20} />
            </button>
            <button
              onClick={() => navigate(-1)}
              className="text-white hover:opacity-75 transition-opacity"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Main Content (Image/Video) */}
        <div className="flex-1 relative flex items-center justify-center">
          <img
            src={segments[currentSegment].url}
            alt="Story Content"
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Navigation Tap Areas */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 cursor-pointer" onClick={handlePrev}></div>
            <div className="flex-1 cursor-pointer" onClick={handleNext}></div>
          </div>

          {/* Navigation Arrows (Visible on Desktop) */}
          <div className="hidden md:block">
            <button
              onClick={handlePrev}
              className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Footer (Actions) */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Send message"
              className="w-full bg-transparent border border-white/50 rounded-full px-4 py-2 text-sm text-white placeholder-white/70 focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <button className="text-white hover:scale-110 active:scale-95 transition-transform">
            <Heart size={24} />
          </button>
          <button className="text-white hover:scale-110 active:scale-95 transition-transform">
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Story;
