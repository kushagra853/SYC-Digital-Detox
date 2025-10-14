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
import { TrendingUp, Clock, Target, Award } from "lucide-react";
import { getUserSubmissions, getUserTotalScreenTime } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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
      // Fetch submissions from backend
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
    // Refresh submissions from backend
    fetchUserSubmissions();
    fetchUserTotalScreenTime();
  };

  const calculateStreak = () => {
    if (submissions.length === 0) return 0;

    const sortedSubmissions = submissions.sort(
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

    // Sort submissions by date
    const sortedSubmissions = submissions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group by date and sum screen time for each day
    const dailyData: { [key: string]: number } = {};

    sortedSubmissions.forEach((submission) => {
      const date = new Date(submission.date).toISOString().split("T")[0];
      if (dailyData[date]) {
        dailyData[date] += submission.totalMinutes;
      } else {
        dailyData[date] = submission.totalMinutes;
      }
    });

    // Convert to chart format
    return Object.entries(dailyData).map(([date, totalMinutes]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      fullDate: date,
      screenTime: (totalMinutes / 60).toFixed(1), // Convert to hours
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-gray-600">
            Track your digital wellbeing and build healthier screen time habits
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Reports</p>
                  <p className="text-3xl font-bold">{submissions.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Avg Screen Time</p>
                  <p className="text-3xl font-bold">
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
                    h
                  </p>
                </div>
                <Clock className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Best Day</p>
                  <p className="text-3xl font-bold">
                    {submissions.length > 0
                      ? (
                          Math.min(...submissions.map((s) => s.totalMinutes)) /
                          60
                        ).toFixed(1)
                      : 0}
                    h
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Current Streak</p>
                  <p className="text-3xl font-bold">
                    {submissions.length > 0 ? calculateStreak() : 0}
                  </p>
                </div>
                <Award className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Total Screen Time</p>
                  <p className="text-3xl font-bold">
                    {totalScreenTime.totalScreenTimeHours}h
                  </p>
                  <p className="text-xs text-indigo-200 mt-1">
                    {totalScreenTime.totalScreenTimeMinutes} minutes
                  </p>
                </div>
                <Clock className="w-8 h-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Reports
                </CardTitle>
                <CardDescription>
                  Your latest screen time uploads
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No reports uploaded yet.</p>
                    <p className="text-sm">
                      Upload your first screen time report to get started!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
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
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">
                              {formatDate(submission.date)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Screen Time: {submission.screenTime}
                            </p>
                          </div>
                          <div className="text-right">
                            <div
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                submission.totalMinutes <= 240
                                  ? "bg-green-100 text-green-800"
                                  : submission.totalMinutes <= 480
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {submission.totalMinutes <= 240
                                ? "Great!"
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
          transition={{ delay: 0.3 }}
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Screen Time Trend
              </CardTitle>
              <CardDescription>
                Your daily screen time over the past submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No data available yet.</p>
                  <p className="text-sm">
                    Upload your first screen time report to see the trend!
                  </p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={processChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#6b7280"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        label={{
                          value: "Hours",
                          angle: -90,
                          position: "insideLeft",
                          style: { textAnchor: "middle" },
                        }}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            const hours = parseFloat(data.screenTime);
                            const status =
                              hours <= 4
                                ? "Great!"
                                : hours <= 8
                                ? "Moderate"
                                : "High";
                            const statusColor =
                              hours <= 4
                                ? "text-green-600"
                                : hours <= 8
                                ? "text-yellow-600"
                                : "text-red-600";

                            return (
                              <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-semibold text-gray-900 mb-1">
                                  {label}
                                </p>
                                <p className="text-blue-600 font-medium">
                                  Screen Time: {data.screenTime}h (
                                  {data.totalMinutes} minutes)
                                </p>
                                <p
                                  className={`text-sm font-medium ${statusColor} mt-1`}
                                >
                                  {status}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="screenTime"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                      />
                    </LineChart>
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
