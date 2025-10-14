import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ArrowLeft,
  Mail,
  User,
  IdCard,
  GraduationCap,
  Sparkles,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

interface AuthFormProps {
  onLogin: (userData: any) => void;
  onBack: () => void;
}

export default function AuthForm({ onLogin, onBack }: AuthFormProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    admNo: "",
    year: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLogin) {
      // Login logic - using in-memory storage instead of localStorage
      const users = JSON.parse(
        sessionStorage.getItem("digitalDetoxUsers") || "[]"
      );
      const user = users.find((u: any) => u.email === formData.email);

      if (user) {
        toast.success("Welcome back!");
        onLogin(user);
      } else {
        toast.error("Account not found. Please sign up first.");
      }
    } else {
      // Signup logic
      if (
        !formData.name ||
        !formData.email ||
        !formData.admNo ||
        !formData.year
      ) {
        toast.error("Please fill all fields");
        return;
      }

      const users = JSON.parse(
        sessionStorage.getItem("digitalDetoxUsers") || "[]"
      );

      // Check if user already exists
      if (users.find((u: any) => u.email === formData.email)) {
        toast.error("Email already registered. Please login.");
        return;
      }
      if (users.find((u: any) => u.admNo === formData.admNo)) {
        toast.error("Admission number already registered.");
        return;
      }

      const newUser = {
        ...formData,
        year: parseInt(formData.year),
        id: Date.now().toString(),
        registeredAt: new Date().toISOString(),
        screenTimeData: [],
        uploads: [],
      };

      users.push(newUser);
      sessionStorage.setItem("digitalDetoxUsers", JSON.stringify(users));

      toast.success("Registration successful! Welcome aboard!");
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0">
          <div className="absolute w-96 h-96 bg-green-400/20 rounded-full blur-3xl top-20 left-10 animate-pulse" />
          <div
            className="absolute w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl bottom-20 right-10 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:block space-y-6"
        >
          <div className="space-y-4">
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <Button
                variant="ghost"
                onClick={onBack}
                className="mb-4 hover:bg-white/50 backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </motion.div>

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
              className="text-6xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
            >
              Digital Detox
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 max-w-md"
            >
              Start your journey to a healthier digital life. Join 60+ students
              in this transformative 10-day program.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            {[
              { icon: Sparkles, text: "Free 10-day program" },
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

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          whileHover={{ y: -5 }}
          className="w-full"
        >
          {/* Mobile Back Button */}
          <div className="md:hidden mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="hover:bg-white/50 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <Card className="border-2 border-green-200 shadow-2xl bg-white/90 backdrop-blur-md hover:shadow-3xl transition-all duration-300">
            <CardHeader className="space-y-2 pb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
              >
                <Lock className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-center text-3xl">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-center text-base">
                {isLogin
                  ? "Login to continue your digital detox journey"
                  : "Join the Digital Detox program today"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4 text-green-600" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required={!isLogin}
                      className="border-2 focus:border-green-400 transition-colors"
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: isLogin ? 0.2 : 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="border-2 focus:border-green-400 transition-colors"
                  />
                </motion.div>

                {!isLogin && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor="admNo"
                        className="flex items-center gap-2"
                      >
                        <IdCard className="w-4 h-4 text-green-600" />
                        Admission Number
                      </Label>
                      <Input
                        id="admNo"
                        placeholder="Enter your admission number"
                        value={formData.admNo}
                        onChange={(e) =>
                          setFormData({ ...formData, admNo: e.target.value })
                        }
                        required={!isLogin}
                        className="border-2 focus:border-green-400 transition-colors"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="year" className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-green-600" />
                        Year & Program
                      </Label>
                      <Select
                        value={formData.year}
                        onValueChange={(value) =>
                          setFormData({ ...formData, year: value })
                        }
                        required
                      >
                        <SelectTrigger className="border-2 focus:border-green-400 transition-colors">
                          <SelectValue placeholder="Select your year & program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">B.Tech - 1st Year</SelectItem>
                          <SelectItem value="2">B.Tech - 2nd Year</SelectItem>
                          <SelectItem value="3">B.Tech - 3rd Year</SelectItem>
                          <SelectItem value="11">MCA - 1st Year</SelectItem>
                          <SelectItem value="12">MCA - 2nd Year</SelectItem>
                          <SelectItem value="21">MBA - 1st Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all text-lg py-6"
                  >
                    {isLogin ? "Login to Dashboard" : "Create Account"}
                  </Button>
                </motion.div>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-sm text-green-600 hover:text-green-700 hover:underline transition-colors"
                  >
                    {isLogin
                      ? "Don't have an account? Sign up for free"
                      : "Already have an account? Login here"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
