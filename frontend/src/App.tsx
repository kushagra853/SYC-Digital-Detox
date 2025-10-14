import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./layout/layout";
import Home from "./pages/Home";
import AuthForm from "./pages/Registration";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Check for existing user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <>
      <Routes>
        <Route element={<Layout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={<Home user={user} />} />
          <Route
            path="/register"
            element={
              <AuthForm
                onRegisterSuccess={handleLogin}
                onBack={() => navigate("/")}
              />
            }
          />
          <Route path="/dashboard" element={<Dashboard user={user} />} />
        </Route>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}