import { useState, useEffect } from "react";
import { motion } from "motion/react";
import ImageUpload from "../components/ImageUpload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  TrendingUp,
  Clock,
  Target,
  Award,
  Users,
  Activity,
} from "lucide-react";
import { getUserSubmissions, getUserTotalScreenTime } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import ScrollToTopOnMount from "../components/ScrollToTop";

interface DashboardProps {
  user: any;
}

interface SubmissionData {
  _id: string;
  uploadId: string;
  screenTime: string;
  totalMinutes: number;
  date: string;
}

export default function Dashboard({ user }: DashboardProps) {
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [totalScreenTime, setTotalScreenTime] = useState({
    totalScreenTimeMinutes: 0,
    totalScreenTimeHours: 0,
    totalSubmissions: 0,
  });

  useEffect(() => {
    if (user) {
      fetchUserSubmissions();
      fetchUserTotalScreenTime();
    }
  }, [user]);

  const fetchUserSubmissions = async () => {
    try {
      const response = await getUserSubmissions(user.id);
      if (response.success) {
        setSubmissions(response.data);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const fetchUserTotalScreenTime = async () => {
    try {
      const response = await getUserTotalScreenTime(user.id);
      if (response.success) {
        setTotalScreenTime(response.data);
      }
    } catch (error) {
      console.error("Error fetching total screen time:", error);
    }
  };

  const handleUploadComplete = () => {
    fetchUserSubmissions();
    fetchUserTotalScreenTime();
  };

  const calculateStreak = () => {
    if (submissions.length === 0) return 0;

    const sortedSubmissions = [...submissions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);

    for (let i = 0; i < sortedSubmissions.length; i++) {
      const submissionDate = new Date(sortedSubmissions[i].date);
      const dateStr = checkDate.toISOString().split("T")[0];
      const submissionDateStr = submissionDate.toISOString().split("T")[0];

      if (dateStr === submissionDateStr) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return currentStreak;
  };

  const processChartData = () => {
    if (submissions.length === 0) return [];

    const sortedSubmissions = [...submissions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dailyData: { [key: string]: number } = {};

    sortedSubmissions.forEach((submission) => {
      const date = new Date(submission.date).toISOString().split("T")[0];
      if (dailyData[date]) {
        dailyData[date] += submission.totalMinutes;
      } else {
        dailyData[date] = submission.totalMinutes;
      }
    });

    return Object.entries(dailyData).map(([date, totalMinutes]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullDate: date,
      screenTime: (totalMinutes / 60).toFixed(1),
      totalMinutes: totalMinutes,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      <ScrollToTopOnMount />
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-semibold text-gray-800 mb-1">
            Welcome back, {user?.name || "User"}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">
                      Total Reports
                    </p>
                    <p className="text-2xl font-semibold text-gray-800">
                      {submissions.length}
                    </p>
                  </div>
                  <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">
                      Avg Screen Time
                    </p>
                    <p className="text-2xl font-semibold text-gray-800">
                      {submissions.length > 0
                        ? (
                            submissions.reduce(
                              (sum, s) => sum + s.totalMinutes,
                              0
                            ) /
                            submissions.length /
                            60
                          ).toFixed(1)
                        : 0}
                      &nbsp;h
                    </p>
                  </div>
                  <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">
                      Best Day
                    </p>
                    <p className="text-2xl font-semibold text-gray-800">
                      {submissions.length > 0
                        ? (
                            Math.min(
                              ...submissions.map((s) => s.totalMinutes)
                            ) / 60
                          ).toFixed(1)
                        : 0}
                      &nbsp;h
                    </p>
                  </div>
                  <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">
                      Current Streak
                    </p>
                    <p className="text-2xl font-semibold text-gray-800">
                      {submissions.length > 0 ? calculateStreak() : 0} days
                    </p>
                  </div>
                  <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-xs font-medium mb-1">
                      Total Screen Time
                    </p>
                    <p className="text-2xl font-semibold text-gray-800">
                      {totalScreenTime.totalScreenTimeHours} h
                    </p>
                  </div>
                  <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ImageUpload user={user} onUploadComplete={handleUploadComplete} />
          </motion.div>

          {/* Recent Uploads */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Recent Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Clock className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm font-medium text-gray-500">
                      No reports uploaded yet.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Upload your first screen time report to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {submissions
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .slice(0, 5)
                      .map((submission) => (
                        <motion.div
                          key={submission._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ x: 4 }}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                        >
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              {formatDate(submission.date)}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Screen Time: {submission.screenTime}
                            </p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                                submission.totalMinutes <= 240
                                  ? "bg-emerald-50 text-emerald-700"
                                  : submission.totalMinutes <= 480
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {submission.totalMinutes <= 240
                                ? "Great"
                                : submission.totalMinutes <= 480
                                ? "Moderate"
                                : "High"}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
        {/* Screen Time Chart - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                Screen Time Trend
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                Your daily screen time over the past submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <TrendingUp className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-medium text-gray-500">
                    No data available yet.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Upload your first screen time report to see the trend!
                  </p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={processChartData()}>
                      <defs>
                        <linearGradient
                          id="colorScreenTime"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6366f1"
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        stroke="#9ca3af"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: "#e5e7eb" }}
                      />
                      <YAxis
                        stroke="#9ca3af"
                        fontSize={11}
                        tickLine={false}
                        axisLine={{ stroke: "#e5e7eb" }}
                        label={{
                          value: "Hours",
                          angle: -90,
                          position: "insideLeft",
                          style: {
                            textAnchor: "middle",
                            fill: "#6b7280",
                            fontSize: 11,
                          },
                        }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const hours = parseFloat(data.screenTime);
                            const status =
                              hours <= 4
                                ? "Great"
                                : hours <= 8
                                ? "Moderate"
                                : "High";
                            const statusColor =
                              hours <= 4
                                ? "text-emerald-600"
                                : hours <= 8
                                ? "text-amber-600"
                                : "text-red-600";

                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium text-gray-800 text-sm mb-1">
                                  {data.date}
                                </p>
                                <p className="text-indigo-600 font-medium text-sm">
                                  {data.screenTime}h ({data.totalMinutes} min)
                                </p>
                                <p
                                  className={`text-xs font-medium ${statusColor} mt-1`}
                                >
                                  {status}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="screenTime"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fill="url(#colorScreenTime)"
                        dot={{ fill: "#6366f1", strokeWidth: 0, r: 3 }}
                        activeDot={{
                          r: 5,
                          stroke: "#6366f1",
                          strokeWidth: 2,
                          fill: "#fff",
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
