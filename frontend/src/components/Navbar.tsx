import { motion } from "motion/react";
import { Heart, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  showGetStarted?: boolean;
}

export default function Navbar({ showGetStarted = true }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg text-gray-900">Digital Detox</div>
              <div className="text-xs text-gray-500">SYC Initiative</div>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#about"
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              About
            </a>

            {showGetStarted && (
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
            )}
          </div>

          {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 space-y-4"
          >
            <a
              href="#about"
              className="block text-gray-600 hover:text-green-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#features"
              className="block text-gray-600 hover:text-green-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#timeline"
              className="block text-gray-600 hover:text-green-600 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Timeline
            </a>
            {showGetStarted && (
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
              >
                Get Started
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
