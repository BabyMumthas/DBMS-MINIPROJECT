import React from "react";
import Navbar from "./components/navbar";  
import Footer from "./components/footer";  
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />  {/* Renders child components */}
      <Footer />
    </div>
  );
};

export default Layout;
