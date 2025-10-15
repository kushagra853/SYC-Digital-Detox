import { motion } from "framer-motion";
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
  Calendar,
  MapPin,
  Trophy,
  Sparkles,
  Zap,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HomeProps {
  user?: any;
}

export default function Home({ user }: HomeProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="relative overflow-hidden pt-24 pb-12">
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
              Join a 10-day journey to reduce screen dependency and rediscover
              the joy of offline living
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4 pt-4"
            >
              {user ? (
                <div>
                  <p className="text-xl text-gray-700 mb-4">
                    Welcome back,{" "}
                    <span className="font-semibold text-green-600">
                      {user.name}
                    </span>
                    &nbsp;!
                  </p>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="text-center"
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-2xl transition-all text-lg px-8 py-6"
                      onClick={() => navigate("/dashboard")}
                    >
                      View Dashboard
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-2xl transition-all text-lg px-8 py-6"
                    onClick={() => navigate("/register")}
                  >
                    Get Started - It's Free
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-20 pt-15"
      >
        <motion.h2 className="text-4xl md:text-5xl font-semibold text-gray-900 text-center mb-4">
          Why Digital Detox?
        </motion.h2>
        <p className="text-gray-600 text-center text-lg max-w-3xl mx-auto mb-16">
          In our hyperconnected world, taking intentional breaks from digital
          devices has become essential for mental and physical well-being
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              whileHover={{ y: -10, rotateY: 5, rotateX: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ transformStyle: "preserve-3d" }}
              className="h-full p-4"
            >
              <Card className="h-full border border-green-200/40 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-2xl text-gray-900">
                    Research-Backed Benefits
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    Regular digital detoxing can lead to transformative changes
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <ul className="space-y-4">
                    {[
                      {
                        icon: "😴",
                        text: "Improved sleep quality and duration",
                      },
                      { icon: "🎯", text: "Enhanced focus and productivity" },
                      { icon: "🧘", text: "Reduced anxiety and stress levels" },
                      {
                        icon: "💬",
                        text: "Better interpersonal relationships",
                      },
                      {
                        icon: "🌟",
                        text: "Increased mindfulness and presence",
                      },
                    ].map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                        whileHover={{ x: 8 }}
                        className="flex items-start gap-3 cursor-default"
                      >
                        <motion.span
                          whileHover={{ scale: 1.3, rotate: 10 }}
                          className="text-2xl flex-shrink-0"
                        >
                          {item.icon}
                        </motion.span>
                        <p className="text-gray-700 pt-1">{item.text}</p>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <motion.div
              whileHover={{ y: -10, rotateY: -5, rotateX: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ transformStyle: "preserve-3d" }}
              className="h-full p-4"
            >
              <Card className="h-full border border-emerald-200/40 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-emerald-50/40 via-green-50/30 to-teal-50/20 group overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative z-10">
                  <CardTitle className="text-2xl text-gray-900">
                    Proven Results
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-2">
                    What participants experienced in 10 days
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-6">
                    {[
                      {
                        percentage: "40%",
                        label: "Overall Well-being",
                        color:
                          "bg-gradient-to-br from-emerald-100 to-emerald-200",
                        textColor: "text-emerald-700",
                      },
                      {
                        percentage: "35%",
                        label: "Sleep Quality",
                        color: "bg-gradient-to-br from-teal-100 to-teal-200",
                        textColor: "text-teal-700",
                      },
                      {
                        percentage: "50%",
                        label: "Anxiety Reduction",
                        color: "bg-gradient-to-br from-green-100 to-green-200",
                        textColor: "text-green-700",
                      },
                    ].map((stat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + idx * 0.15, type: "spring" }}
                        whileHover={{ scale: 1.05, x: 10 }}
                        className="group/stat cursor-default"
                      >
                        <div className="flex items-center gap-4">
                          <motion.div
                            className={`w-20 h-20 rounded-2xl ${stat.color} flex items-center justify-center shadow-md group-hover/stat:shadow-lg transition-shadow flex-shrink-0`}
                          >
                            <span
                              className={`text-3xl font-bold ${stat.textColor}`}
                            >
                              {stat.percentage}
                            </span>
                          </motion.div>
                          <div className="flex-1">
                            <p className="text-lg font-semibold text-gray-900">
                              {stat.label}
                            </p>
                            <p className="text-sm text-gray-600">Improvement</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            style={{ transformStyle: "preserve-3d" }}
            className="p-8 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                className="inline-block mb-4"
              >
                <Sparkles className="w-12 h-12 text-white drop-shadow-lg" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                Join Us in This Transformative Journey
              </h3>
              <p className="text-green-50 text-lg max-w-2xl mx-auto">
                Reclaim your time and attention. Experience the life-changing
                benefits of a digital detox.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-8 mb-20">
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
          ].map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: item.delay }}
              className="perspective"
            >
              <motion.div
                whileHover={{ y: -15, rotateX: 8 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card className="h-full border border-green-200/40 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative z-10">
                    <motion.div className="inline-flex">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-shadow">
                        <item.icon className="w-7 h-7 text-green-600" />
                      </div>
                    </motion.div>
                    <CardTitle className="text-2xl mt-4">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <p className="text-lg font-semibold text-gray-900">
                      {item.text}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{item.subtext}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <motion.h2 className="text-4xl md:text-5xl font-semibold text-gray-900 text-center mb-4">
            Program Objectives
          </motion.h2>
          <p className="text-gray-600 text-center text-lg max-w-2xl mx-auto mb-16">
            Transform your relationship with technology through our
            comprehensive approach
          </p>

          <div className="grid md:grid-cols-3 gap-6">
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
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: item.delay }}
              >
                <motion.div
                  whileHover={{ scale: 1.08, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 250 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="h-full p-8 rounded-3xl bg-gradient-to-br from-white to-green-50/40 border border-green-200/40 shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 via-emerald-500/0 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow"
                    >
                      <item.icon className="w-8 h-8 text-green-600" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <motion.h2 className="text-4xl md:text-5xl font-semibold text-gray-900 text-center mb-4">
            Program Features
          </motion.h2>
          <p className="text-gray-600 text-center text-lg max-w-2xl mx-auto mb-16">
            Everything you need to succeed in your digital detox journey
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Smartphone,
                title: "Screen Time Tracking",
                desc: "Monitor your daily screen usage and upload your digital wellbeing reports",
                delay: 0,
              },
              {
                icon: Zap,
                title: "Awareness Reports",
                desc: "Receive periodic insights and progress updates throughout the program",
                delay: 0.1,
              },
              {
                icon: Trophy,
                title: "Certification",
                desc: "Earn a participation certificate upon completing the program",
                delay: 0.15,
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: item.delay }}
              >
                <motion.div
                  whileHover={{ y: -12, rotateY: 8, rotateX: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="h-full"
                >
                  <Card className="h-full border border-green-200/40 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white via-green-50/20 to-emerald-50/10 group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="relative z-10">
                      <div className="flex items-start gap-4">
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: -10 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow"
                        >
                          <item.icon className="w-6 h-6 text-green-600" />
                        </motion.div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-3 text-gray-600">
                        {item.desc}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <motion.h2 className="text-4xl md:text-5xl font-semibold text-gray-900 text-center mb-4">
            Rules and Regulations
          </motion.h2>
          <p className="text-gray-600 text-center text-lg max-w-2xl mx-auto mb-16">
            Rules for submission and elimination of participants
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.div
                whileHover={{ y: -12, rotateY: 5, rotateX: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ transformStyle: "preserve-3d" }}
                className="h-full"
              >
                <Card className="h-full border border-green-200/40 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/20 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: -10 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow"
                      >
                        <Target className="w-6 h-6 text-green-600" />
                      </motion.div>
                      <CardTitle className="text-2xl text-gray-900">
                        Submission Rules
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-4">
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-700">
                          Clear screenshot of digital wellbeing required
                        </p>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-700">
                          Submission window:{" "}
                          <span className="font-semibold">
                            10:00 PM to 11:59 PM
                          </span>
                        </p>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-6"
                      >
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-green-600" />
                          Image Submission Guidelines
                        </h3>
                        <ul className="space-y-2 ml-6">
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span className="text-gray-600">
                              Use a clear, high-resolution screenshot
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span className="text-gray-600">
                              Ensure screen time text is visible and not cropped
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span className="text-gray-600">
                              Avoid blurry or low-light images
                            </span>
                          </li>
                        </ul>
                      </motion.li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <motion.div
                whileHover={{ y: -12, rotateY: -5, rotateX: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ transformStyle: "preserve-3d" }}
                className="h-full"
              >
                <Card className="h-full border border-red-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-red-50/40 via-orange-50/30 to-amber-50/20 group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-shadow"
                      >
                        <Zap className="w-6 h-6 text-red-600" />
                      </motion.div>
                      <CardTitle className="text-2xl text-gray-900">
                        Elimination Rules
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-4">
                      <motion.li
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-700">
                          Missing{" "}
                          <span className="font-semibold">
                            2 or more submissions
                          </span>
                        </p>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-700">
                          Submitting{" "}
                          <span className="font-semibold">
                            falsified or edited screenshots
                          </span>
                        </p>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <p className="text-gray-700">
                          Exceeding the daily limit by more than 2 hours{" "}
                          <span className="font-semibold">
                            consecutively 2 times
                          </span>{" "}
                          and a{" "}
                          <span className="font-semibold">
                            total of 3 times
                          </span>{" "}
                          will result in disqualification
                        </p>
                      </motion.li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-200/50 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Sparkles className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    Important Notice
                  </h3>
                  <p className="text-gray-700">
                    Phones of the podium finishers will be checked by
                    authorities to ensure fair play and avoid any cheating.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden p-5"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{ transformStyle: "preserve-3d" }}
            className="text-center space-y-8 py-20 px-8 bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 rounded-3xl shadow-xl relative overflow-hidden group"
          >
            <div className="relative z-10 ">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="flex justify-center"
              >
                <Trophy className="w-24 h-24 text-white drop-shadow-lg" />
              </motion.div>

              <h2 className="text-4xl md:text-5xl font-bold text-white mt-6">
                Ready to Reclaim Your Life?
              </h2>

              <p className="text-green-100 text-xl max-w-3xl mx-auto px-4 mt-4">
                Join us in transforming your relationship with technology. Start
                your 10-day journey today.
              </p>

              <motion.div
                whileHover={{ scale: 1.15, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block mt-8"
              >
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 shadow-2xl hover:shadow-2xl transition-all text-lg px-10 py-7 font-semibold"
                  onClick={
                    user
                      ? () => navigate("/dashboard")
                      : () => navigate("/register")
                  }
                >
                  {user ? "Continue Your Journey" : "Register Now - It's Free"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
