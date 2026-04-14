import React from "react";
import { NavLink, Link } from "react-router";
import { useSelector } from "react-redux";
import {
  Home,
  Search,
  PlusSquare,
  Bell,
  User,
  MessageCircle,
  Menu,
} from "lucide-react";

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Search", path: "/search", icon: Search },
  { name: "Messages", path: "/messages", icon: MessageCircle },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Create", path: "/create", icon: PlusSquare },
  { name: "Profile", path: "/profile", icon: User },
];

const Sidebar = () => {
  const user = useSelector((state) => state.auth.user);
  const avatarUrl = user?.profilePicture || user?.prfilePicture;
  const initials =
    user?.fullname
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <nav className="fixed left-0 top-0 hidden md:flex flex-col w-[245px] h-screen bg-white border-r border-gray-200 px-3 py-6 z-50">
        {/* Logo */}
        <div className="px-3 mb-8">
          <h1 className="text-[22px] font-black tracking-tight text-gray-900 italic select-none">
            Instagram
          </h1>
        </div>

        {/* Nav Links */}
        <div className="flex-1 flex flex-col gap-0.5">
          {navItems.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={name}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-3 py-3 rounded-xl text-sm transition-colors duration-150 ${
                  isActive
                    ? "font-bold text-gray-900 bg-gray-100"
                    : "font-normal text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="hidden lg:block">{name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom: More + User */}
        <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
          <button className="flex items-center gap-4 px-3 py-3 rounded-xl text-sm font-normal text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full">
            <Menu size={24} strokeWidth={2} />
            <span className="hidden lg:block">More</span>
          </button>

          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center flex-shrink-0">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold text-gray-500">{initials}</span>
                )}
              </div>
              <div className="hidden lg:block min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 truncate leading-none">
                  {user.username}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{user.fullname}</p>
              </div>
            </Link>
          )}
        </div>
      </nav>

      {/* ── Mobile Bottom Bar ── */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="flex justify-around items-center h-14 px-2">
          {navItems
            .filter(({ name }) =>
              ["Home", "Search", "Create", "Messages", "Profile"].includes(name)
            )
            .map(({ name, path, icon: Icon }) => (
              <NavLink key={name} to={path} end={path === "/"} className="p-2">
                {({ isActive }) => (
                  <Icon
                    size={24}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={isActive ? "text-gray-900" : "text-gray-500"}
                  />
                )}
              </NavLink>
            ))}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
