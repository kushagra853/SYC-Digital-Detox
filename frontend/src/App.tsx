import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./layout/layout";
import Home from "./pages/Home";
import AuthForm from "./pages/Registration";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Check for existing user session on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    sessionStorage.setItem("currentUser", JSON.stringify(userData));
    navigate("/");
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/register"
            element={
              <AuthForm onLogin={handleLogin} onBack={() => navigate("/")} />
            }
          />
        </Route>
      </Routes>
    </>
  );
}
