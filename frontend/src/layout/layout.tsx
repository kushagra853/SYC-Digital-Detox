import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-40">
        <Navbar />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
