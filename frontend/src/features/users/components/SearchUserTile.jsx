import { useSelector } from "react-redux";
import { useUser } from "../hooks/useUser";

const SearchUserTile = ({ user }) => {
  const { handleFollowUser } = useUser();
  const requested = useSelector((state) => state.user.requested);
  const currentUserId = useSelector((state) => state.auth.user?.id);
  const isCurrentUser =
    String(user?._id ?? user?.id ?? "") === String(currentUserId ?? "");

  const handleClick = async (userId) => {
    await handleFollowUser({ userId });
  };

  const isFollowing = user.followStatus === "following";
  const isRequested =
    requested.includes(user._id) || user.followStatus === "requested";

  return (
    <div className="flex items-center justify-between px-1 py-2.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar */}
        <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
          <img
            src={
              user.profilePicture ||
              `https://ui-avatars.com/api/?name=${
                user.username || "U"
              }&background=f3f4f6&color=6b7280&bold=true`
            }
            alt={user.username}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-gray-900 truncate leading-tight">
            {user.username}
          </span>
          {user.fullname && (
            <span className="text-sm text-gray-400 truncate mt-0.5">
              {user.fullname}
            </span>
          )}
        </div>
      </div>

      {/* Follow button */}
      {!isCurrentUser && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClick(user._id);
          }}
          className={`flex-shrink-0 ml-4 px-4 py-[6px] rounded-lg text-sm font-semibold transition-colors active:scale-95 ${
            isFollowing
              ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
              : isRequested
              ? "bg-gray-100 text-gray-500 hover:bg-gray-200"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isRequested ? "Requested" : isFollowing ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
};

export default SearchUserTile;
