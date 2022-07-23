import React from "react";
import Navbar from "../components/Navbar";

const Layout = ({ children }) => {
  return (
    <div className="h-[calc(100vh-64px)]">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
