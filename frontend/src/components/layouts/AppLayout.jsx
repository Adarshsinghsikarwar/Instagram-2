import React from "react";
import { Outlet } from "react-router";
import Sidebar from "../navigation/Sidebar";

const AppLayout = () => {
  return (
    <div className="bg-zinc-50 min-h-screen md:ps-[244px] w-full">
      {/* Navigation (Sidebar Desktop / Bottom Bar Mobile) */}
      <Sidebar />

      {/* Main content — offset by sidebar width on md+ screens */}
      <main className="md:ml-[245px] min-h-screen pb-16 md:pb-0">
        <div className="w-full h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
