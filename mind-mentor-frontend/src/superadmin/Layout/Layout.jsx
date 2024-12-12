// Layout.js
import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "../../component/parent-component/parent-dashboard/layout/Topbar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
