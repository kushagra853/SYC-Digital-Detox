import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Smartphone,
  Brain,
  Heart,
  Users,
  Calendar,
  MapPin,
  Trophy,
  Sparkles,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  user?: any;
}

export default function Home({ user }: HomeProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 pb-12">
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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-green-200 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-900">
                Organized by Sanjeevani and Yoga Club
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl text-gray-900 max-w-4xl mx-auto"
            >
              Digital Detox
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl md:text-3xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent max-w-3xl mx-auto"
            >
              "Unplug to Recharge: Balance Your Screen, Reclaim Your Life"
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-gray-700 max-w-2xl mx-auto"
            >
              Join us for a transformative 10-day journey to reduce screen
              dependency and rediscover the joy of offline living
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-center"
                >
                  <p className="text-xl text-gray-700 mb-4">
                    Welcome back, <span className="font-bold text-green-600">{user.name}</span>!
                  </p>
                  <Button
                    size="lg"
                    onClick={() => navigate("/dashboard")}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-2xl transition-all text-lg px-8 py-6"
                  >
                    Go to Dashboard
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => navigate("/register")}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-2xl transition-all text-lg px-8 py-6"
                  >
                    Get Started - It's Free
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div
        id="details"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Calendar,
              title: "Duration",
              text: "17th Oct - 26th Oct 2025",
              subtext: "10 days of transformation",
              delay: 0,
            },
            {
              icon: MapPin,
              title: "Venue",
              text: "Online Event",
              subtext: "Join from anywhere",
              delay: 0.1,
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: item.delay }}
              whileHover={{ y: -10, rotateX: 5 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Card className="h-full border-2 border-transparent hover:border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-green-50/30">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <item.icon className="w-8 h-8 text-green-600 mb-2" />
                  </motion.div>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.text}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.subtext}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Objectives */}
        <div className="mb-16" id="about">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl text-gray-900 text-center mb-12"
          >
            Program Objectives
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Smartphone,
                title: "Track & Reduce Screen Time",
                desc: "Become aware of your digital habits and gradually reduce screen dependency",
                color: "green",
                delay: 0,
              },
              {
                icon: Heart,
                title: "Healthier Lifestyle",
                desc: "Promote offline engagement and develop healthier daily habits",
                color: "emerald",
                delay: 0.1,
              },
              {
                icon: Brain,
                title: "Mindfulness & Focus",
                desc: "Foster better real-world connections and improve mental clarity",
                color: "teal",
                delay: 0.2,
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item.delay }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="text-center space-y-4 p-6 rounded-2xl hover:shadow-2xl transition-all duration-300 bg-white/50 backdrop-blur-sm"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`w-20 h-20 bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 rounded-2xl flex items-center justify-center mx-auto shadow-lg`}
                >
                  <item.icon className={`w-10 h-10 text-${item.color}-600`} />
                </motion.div>
                <h3 className="text-xl text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16" id="features">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl text-gray-900 text-center mb-12"
          >
            Program Features
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                emoji: "",
                title: "Screen Time Tracking",
                desc: "Monitor your daily screen usage and upload your digital wellbeing reports",
                delay: 0,
              },
              {
                emoji: "",
                title: "Awareness Reports",
                desc: "Receive periodic insights and progress updates throughout the program",
                delay: 0.1,
              },
              {
                emoji: "",
                title: "Daily Tips & Challenges",
                desc: "Get suggestions for offline activities like exercise, reading, and socializing",
                delay: 0.2,
              },
              {
                emoji: "",
                title: "Certification",
                desc: "Earn a participation certificate upon completing the program",
                delay: 0.3,
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item.delay }}
                whileHover={{ scale: 1.03, rotateY: 5 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card className="h-full border-2 border-transparent hover:border-green-300 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white via-green-50/20 to-emerald-50/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <motion.span
                        whileHover={{ scale: 1.3, rotate: 10 }}
                        className="text-2xl"
                      >
                        {item.emoji}
                      </motion.span>
                      {item.title}
                    </CardTitle>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden text-center space-y-6 py-16 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 rounded-3xl shadow-2xl"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl top-0 left-0 animate-pulse" />
            <div
              className="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl bottom-0 right-0 animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="w-20 h-20 text-white mx-auto drop-shadow-lg" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl text-white mt-4">
              Ready to Transform Your Digital Life?
            </h2>
            <p className="text-green-100 text-lg max-w-2xl mx-auto px-4 pt-3 pb-5">
              {user ? "Continue your journey" : "Register Now"}
            </p>
            <motion.div
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              {user ? (
                <Button
                  onClick={() => navigate("/dashboard")}
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-6 mt-2"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/register")}
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all text-lg px-8 py-6 mt-2"
                >
                  Register Now - Free
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}