import { motion } from "framer-motion";
import { Menu, X, User, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  showGetStarted?: boolean;
  user?: { name: string; [key: string]: any };
  onLogout?: () => void;
}

export default function Navbar({
  showGetStarted = true,
  user,
  onLogout,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
          >
            <div className="w-11 h-11 bg-gradient-to-br from-white to-zinc-100 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
              <img
                src="/logo.png"
                alt="Digital Detox Logo"
                className="w-11 h-11"
              />
            </div>
            <div>
              <div className="text-lg text-gray-900">Digital Detox</div>
              <div className="text-xs text-gray-500">SYC Initiative</div>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </button>

                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 border border-gray-100 p-2 space-y-1"
                  >
                    <button
                      onClick={() => {
                        navigate("/dashboard");
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors rounded-md"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={() => {
                        onLogout?.();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600 transition-colors rounded-md"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : showGetStarted ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </Button>
              </motion.div>
            ) : null}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 space-y-4"
          >
            {user ? (
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <a
                  href="/dashboard"
                  className="block text-gray-600 hover:text-green-600 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/dashboard");
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </a>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {user.name}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onLogout?.();
                      setMobileMenuOpen(false);
                    }}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : showGetStarted ? (
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/register");
                }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
              >
                Get Started
              </Button>
            ) : null}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
