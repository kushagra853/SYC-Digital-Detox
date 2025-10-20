import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  GraduationCap,
  Sparkles,
  Lock,
  Loader2,
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import api, { loginUser } from "../api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import ScrollToTopOnMount from "../components/ScrollToTop";

// Format: YYYY-MM-DDTHH:MM:SS
const REGISTRATION_CLOSE_DATE = new Date("2025-10-30T00:00:00");

const currentDate = new Date();
const isRegistrationClosed = currentDate > REGISTRATION_CLOSE_DATE;

interface RegistrationPageProps {
  onRegisterSuccess: (userData: any) => void;
  onLoginSuccess: (userData: any) => void;
  onBack: () => void;
}

function AuthToggle({
  isLogin,
  onToggle,
  isRegistrationClosed,
}: {
  isLogin: boolean;
  onToggle: () => void;
  isRegistrationClosed: boolean;
}) {
  if (isRegistrationClosed) {
    return null;
  }

  return (
    <div className="flex justify-center mb-6">
      <div className="flex space-x-1 rounded-full bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => {
            if (isLogin) onToggle();
          }}
          className={`relative rounded-full px-5 py-1.5 text-sm font-medium transition focus:outline-none ${
            isLogin ? "text-slate-600" : "text-white"
          }`}
        >
          <span className="relative z-10">Register</span>
          {!isLogin && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 rounded-full bg-green-600"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            if (!isLogin) onToggle();
          }}
          className={`relative rounded-full px-5 py-1.5 text-sm font-medium transition focus:outline-none ${
            isLogin ? "text-white" : "text-slate-600"
          }`}
        >
          <span className="relative z-10">Login</span>
          {isLogin && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 rounded-full bg-green-600"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
        </button>
      </div>
    </div>
  );
}

export default function RegistrationPage({
  onRegisterSuccess,
  onLoginSuccess,
  onBack,
}: RegistrationPageProps) {
  const [isLogin, setIsLogin] = useState(isRegistrationClosed);

  const handleToggle = () => {
    if (!isRegistrationClosed) {
      setIsLogin((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <ScrollToTopOnMount />
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-green-400/20 rounded-full blur-3xl top-20 left-10 animate-pulse" />
          <div
            className="absolute w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl bottom-20 right-10 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block space-y-6"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 cursor-pointer"
          >
            <div className="w-40 h-40 bg-gradient-to-br from-white to-zinc-100 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <img
                src="/logo.webp"
                alt="Digital Detox Logo"
                className="w-40 h-40"
              />
            </div>
          </motion.div>
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl text-gray-900"
            >
              Welcome to
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent pb-4"
            >
              Digital Detox
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 max-w-md"
            >
              Join in this transformative 10-day Event and win prizes along.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            {[
              { icon: Sparkles, text: "Free 10-day Event" },
              { icon: GraduationCap, text: "Certificate on completion" },
              { icon: User, text: "Personalized tracking" },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 bg-white/60 backdrop-blur-sm p-3 rounded-lg"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-gray-700">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          {isLogin ? (
            <LoginForm
              onLoginSuccess={onLoginSuccess}
              onBack={onBack}
              onToggleForm={handleToggle}
              isLogin={isLogin}
              isRegistrationClosed={isRegistrationClosed}
            />
          ) : (
            <RegistrationForm
              onRegisterSuccess={onRegisterSuccess}
              onBack={onBack}
              onToggleForm={handleToggle}
              isLogin={isLogin}
              isRegistrationClosed={isRegistrationClosed}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

interface RegisterFormProps {
  onRegisterSuccess: (userData: any) => void;
  onBack: () => void;
  onToggleForm: () => void;
  isLogin: boolean;
  isRegistrationClosed: boolean;
}

function RegistrationForm({
  onRegisterSuccess,
  onBack,
  onToggleForm,
  isLogin,
  isRegistrationClosed,
}: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    admNo: "",
    year: "",
    whatsappNumber: "",
    phoneType: "",
    password: "",
    confirmPassword: "",
  });

  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (Object.values(formData).some((val) => val === "")) {
      const errorMsg = "Please fill in all required fields";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    if (formData.password.length < 6) {
      const errorMsg = "Password must be at least 6 characters long";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    if (!passwordsMatch) {
      const errorMsg = "Passwords do not match";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    try {
      console.log(formData);
      const response = await api.post("/auth/signup", {
        ...formData,
      });
      toast.success(response.data.message || "Registration successful!");
      onRegisterSuccess(response.data.user);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (error) setError(null);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          <AuthToggle
            isLogin={isLogin}
            onToggle={onToggleForm}
            isRegistrationClosed={isRegistrationClosed}
          />
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-sm mb-4 border border-green-100">
              <User className="w-7 h-7 text-green-700" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-1">
              Create an Account
            </h1>
            <p className="text-sm text-slate-500">
              Join the Digital Detox today
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-slate-700 block"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-slate-700 block"
              >
                College Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="User.24b01011XX@abes.ac.in"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="admNo"
                className="text-sm font-medium text-slate-700 block"
              >
                Admission Number
              </label>
              <input
                id="admNo"
                type="text"
                value={formData.admNo}
                onChange={handleInputChange}
                placeholder="Enter your admission number"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700 block"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Password must be at least 6 characters long.
                </p>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-slate-700 block"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    className={`w-full pl-4 pr-10 py-2.5 bg-slate-50 border rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      formData.confirmPassword && !passwordsMatch
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-200 focus:ring-green-500"
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-600 mt-1">
                    Passwords do not match.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="whatsappNumber"
                className="text-sm font-medium text-slate-700 block"
              >
                WhatsApp Number
              </label>
              <input
                id="whatsappNumber"
                type="tel"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                placeholder="Enter your WhatsApp number"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="phoneType"
                className="text-sm font-medium text-slate-700 block"
              >
                Phone Type
              </label>
              <input
                id="phoneType"
                type="text"
                value={formData.phoneType}
                onChange={handleInputChange}
                placeholder="e.g., Samsung, iPhone, etc."
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="year"
                className="text-sm font-medium text-slate-700 block"
              >
                Year & Program
              </label>
              <Select
                value={formData.year}
                onValueChange={(value) => {
                  setFormData({ ...formData, year: value });
                  if (error) setError(null);
                }}
                required
                disabled={isLoading}
              >
                <SelectTrigger className="w-full px-4 py-2.5 h-auto bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                  <SelectValue placeholder="Select your year & program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="B.Tech  - 1st year">
                    B.Tech - 1st Year
                  </SelectItem>
                  <SelectItem value="B.Tech - 2nd Year">
                    B.Tech - 2nd Year
                  </SelectItem>
                  <SelectItem value="B.Tech - 3rd Year">
                    B.Tech - 3rd Year
                  </SelectItem>
                  <SelectItem value="MCA - 1st Year">MCA - 1st Year</SelectItem>
                  <SelectItem value="MCA - 2nd Year">MCA - 2nd Year</SelectItem>
                  <SelectItem value="MBA - 1st Year">MBA - 1st Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

interface LoginFormProps {
  onLoginSuccess: (userData: any) => void;
  onBack: () => void;
  onToggleForm: () => void;
  isLogin: boolean;
  isRegistrationClosed: boolean;
}

function LoginForm({
  onLoginSuccess,
  onBack,
  onToggleForm,
  isLogin,
  isRegistrationClosed,
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ admNo: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.admNo || !formData.password) {
      const errorMsg = "Please enter both admission number and password";
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    setIsLoading(true);
    try {
      const response = await loginUser(formData);
      toast.success(response.message || "Login successful!");
      onLoginSuccess(response.user);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8">
          <AuthToggle
            isLogin={isLogin}
            onToggle={onToggleForm}
            isRegistrationClosed={isRegistrationClosed}
          />

          {isRegistrationClosed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                Registration for the event is now closed. Please log in to
                continue.
              </p>
            </motion.div>
          )}

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-sm mb-4 border border-green-100">
              <LogIn className="w-7 h-7 text-green-700" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-800 mb-1">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500">
              Sign in to continue your Digital Detox
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="admNo"
                className="text-sm font-medium text-slate-700 block"
              >
                Admission Number
              </label>
              <input
                id="admNo"
                type="text"
                value={formData.admNo}
                onChange={(e) => {
                  setFormData({ ...formData, admNo: e.target.value });
                  if (error) setError(null);
                }}
                placeholder="Enter your admission number"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-slate-700 block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (error) setError(null);
                  }}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
