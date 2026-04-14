import { useState, useRef } from "react";
import { ImagePlus, X, Smile, MapPin, ChevronDown } from "lucide-react";
import { usePost } from "../hooks/usePost";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const CreatePost = () => {
  const [dragActive, setDragActive] = useState(false);
  const [caption, setCaption] = useState("");
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const filesRef = useRef(null);
  const fileInputRef = useRef(null);
  const { handleCreatePost } = usePost();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth?.user);

  const avatarUrl = user?.profilePicture || user?.prfilePicture;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const processFiles = (files) => {
    filesRef.current = files;
    const urls = Array.from(files).map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) processFiles(e.target.files);
  };

  const clearFiles = () => {
    previews.forEach(URL.revokeObjectURL);
    setPreviews([]);
    filesRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleShare = async () => {
    if (!filesRef.current) return;
    setIsSubmitting(true);
    try {
      await handleCreatePost({ files: filesRef.current, caption });
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasFiles = previews.length > 0;

  return (
    <div className="max-w-[470px] mx-auto px-4 py-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Create new post
        </h1>
        {hasFiles && (
          <button
            onClick={handleShare}
            disabled={isSubmitting}
            className="text-sm font-bold text-blue-500 hover:text-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Sharing..." : "Share"}
          </button>
        )}
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Media Upload / Preview Area */}
        {!hasFiles ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center p-12 transition-colors min-h-[350px] ${
              dragActive ? "bg-blue-50" : "bg-gray-50"
            }`}
          >
            <div className="w-20 h-20 rounded-full border-2 border-gray-200 flex items-center justify-center mb-5">
              <ImagePlus size={32} className="text-gray-300" strokeWidth={1.5} />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-1">
              Drag photos and videos here
            </p>
            <p className="text-sm text-gray-400 mb-6">
              JPG, PNG, MP4 — up to 50MB
            </p>
            <label className="px-5 py-2.5 bg-blue-500 text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-blue-600 transition-colors active:scale-95">
              Select from computer
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                type="file"
                className="hidden"
                accept="image/*,video/*"
                multiple
              />
            </label>
          </div>
        ) : (
          <div className="relative">
            {/* Preview grid */}
            <div className={`grid gap-0.5 ${previews.length === 1 ? "" : "grid-cols-2"}`}>
              {previews.map((url, i) => (
                <div key={i} className="aspect-square bg-gray-100 overflow-hidden">
                  <img src={url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {/* Clear button */}
            <button
              onClick={clearFiles}
              className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-white" strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Caption Section */}
        <div className="border-t border-gray-200">
          {/* User info */}
          <div className="flex items-center gap-3 px-4 pt-4">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={user?.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-gray-400 bg-gray-100">
                  {user?.fullname?.[0] || "U"}
                </div>
              )}
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {user?.username || "you"}
            </span>
          </div>

          {/* Caption textarea */}
          <div className="px-4 py-3">
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              maxLength={2200}
              className="w-full resize-none bg-transparent outline-none text-sm text-gray-900 placeholder-gray-400 leading-relaxed"
              rows={5}
            />
          </div>

          {/* Footer toolbar */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Smile size={20} />
            </button>
            <span className="text-xs text-gray-300 font-medium tabular-nums">
              {caption.length}/2,200
            </span>
          </div>

          {/* Optional Add Location */}
          <button className="flex items-center justify-between w-full px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-sm text-gray-900">Add location</span>
            <MapPin size={16} className="text-gray-400" />
          </button>

          {/* Accessibility */}
          <button className="flex items-center justify-between w-full px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors">
            <span className="text-sm text-gray-900">Accessibility</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>

          {/* Advanced Settings */}
          <button className="flex items-center justify-between w-full px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors rounded-b-xl">
            <span className="text-sm text-gray-900">Advanced settings</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
