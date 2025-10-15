import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  LogOut,
  Shield,
  Users,
  Trophy,
  BarChart3,
  Menu,
  X,
  Award,
  Clock,
  TrendingUp,
} from "lucide-react";
import {
  getAdminUsers,
  getDailyStandings,
  getOverallStandings,
  getAdminStats,
  getWeeklyStandings,
} from "../api";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

type ActiveTab = "users" | "standings";

interface UserData {
  _id: string;
  name: string;
  admNo: string;
  year: number;
  email: string;
  whatsappNumber: string;
  phoneType: string;
  totalScreenTime: number;
  screenTimeSubmissions: any[];
  createdAt: string;
}

interface StandingData {
  _id: string;
  name: string;
  admNo: string;
  year: number;
  totalMinutes: number;
  totalHours: number;
  submissionsCount: number;
  lastSubmission: string | null;
}

interface AdminStats {
  totalUsers: number;
  totalSubmissions: number;
  usersWithSubmissions: number;
  todaySubmissions: number;
}

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("standings");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [dailyStandings, setDailyStandings] = useState<StandingData[]>([]);
  const [overallStandings, setOverallStandings] = useState<StandingData[]>([]);
  const [weeklyData, setWeeklyData] = useState<any>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const adminSession = localStorage.getItem("adminSession");
    if (adminSession) {
      const session = JSON.parse(adminSession);
      if (session.isAuthenticated) {
        setIsAdmin(true);
        fetchAdminData();
      } else {
        navigate("/admin/login");
      }
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, dailyRes, overallRes, weeklyRes, statsRes] =
        await Promise.all([
          getAdminUsers(),
          getDailyStandings(),
          getOverallStandings(),
          getWeeklyStandings(),
          getAdminStats(),
        ]);

      if (usersRes.success) setUsers(usersRes.data);
      if (dailyRes.success) setDailyStandings(dailyRes.data);
      if (overallRes.success) {
        const sorted = overallRes.data.sort(
          (a: StandingData, b: StandingData) => a.totalMinutes - b.totalMinutes
        );
        setOverallStandings(sorted);
      }
      if (weeklyRes.success) setWeeklyData(weeklyRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    setIsAdmin(false);
    navigate("/admin/login");
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 bg-green-400/20 rounded-full blur-3xl top-20 left-10 animate-pulse" />
        <div
          className="absolute w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl bottom-20 right-10 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 border-r border-green-200/50`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-green-200/50 bg-gradient-to-r from-green-50 to-emerald-50">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </motion.div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-green-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-2">
            <motion.button
              onClick={() => setActiveTab("users")}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                activeTab === "users"
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-md border-r-4 border-green-600"
                  : "text-gray-700 hover:bg-green-50 hover:shadow-sm"
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Total Users</span>
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("standings")}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                activeTab === "standings"
                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 shadow-md border-r-4 border-green-600"
                  : "text-gray-700 hover:bg-green-50 hover:shadow-sm"
              }`}
            >
              <Trophy className="w-5 h-5" />
              <span className="font-medium">Standings</span>
            </motion.button>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-200/50 bg-white/50 backdrop-blur-sm">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:ml-64 relative z-10">
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-green-200/50"
        >
          <div className="flex items-center justify-between h-15.5 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-green-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {activeTab === "users" ? "Total Users" : "Standings"}
              </h1>
            </div>
          </div>
        </motion.header>

        <main className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading data...</p>
              </div>
            </div>
          ) : (
            <>
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    {
                      label: "Total Users",
                      value: stats.totalUsers,
                      icon: Users,
                      color: "blue",
                      delay: 0,
                    },

                    {
                      label: "Total Submissions",
                      value: stats.totalSubmissions,
                      icon: BarChart3,
                      color: "purple",
                      delay: 0.2,
                    },
                    {
                      label: "Today's Submissions",
                      value: stats.todaySubmissions,
                      icon: Clock,
                      color: "orange",
                      delay: 0.3,
                    },
                  ].map((stat) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: stat.delay }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Card className="border-2 border-transparent hover:border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                {stat.label}
                              </p>
                              <motion.p
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: stat.delay + 0.2 }}
                                className="text-3xl font-bold text-gray-900 mt-1"
                              >
                                {stat.value}
                              </motion.p>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              transition={{ duration: 0.5 }}
                              className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 rounded-xl flex items-center justify-center shadow-md`}
                            >
                              <stat.icon
                                className={`w-6 h-6 text-${stat.color}-600`}
                              />
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "users" && <UsersView users={users} />}
              {activeTab === "standings" && (
                <StandingsView
                  dailyStandings={dailyStandings}
                  overallStandings={overallStandings}
                  weeklyData={weeklyData}
                />
              )}
            </>
          )}
        </main>
      </div>
    </motion.div>
  );
}

function UsersView({ users }: { users: UserData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <Card className="border-2 border-transparent hover:border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            All Registered Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-green-100">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Admission No.
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Year
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Phone
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Total Screen Time
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Submissions
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b hover:bg-green-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.admNo}</td>
                    <td className="py-3 px-4 text-gray-600">{user.year}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {user.whatsappNumber}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                        {user.totalScreenTime}mins
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {user.screenTimeSubmissions?.length || 0}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StandingsView({
  dailyStandings,
  overallStandings,
  weeklyData,
}: {
  dailyStandings: StandingData[];
  overallStandings: StandingData[];
  weeklyData: any;
}) {
  const barColors = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#f97316",
  ];

  const groupedBarChartData = weeklyData?.users.map((user: any) => {
    const userData: { [key: string]: any } = { name: user.name };
    weeklyData.chartData.forEach((dayData: any) => {
      const hours = dayData[user.name] || 0;
      userData[dayData.day] = Math.round(hours * 60) || 0;
    });
    return userData;
  });

  const daysOfWeek = weeklyData?.chartData.map((d: any) => d.day) || [];

  return (
    <div className="space-y-8">
      {weeklyData &&
        weeklyData.chartData &&
        weeklyData.chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -2 }}
          >
            <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
                  <BarChart3 className="w-5 h-5 text-gray-600" />
                  Daily Time Spent by Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  style={{
                    width: "100%",
                    height: 300 + groupedBarChartData.length * 50,
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={groupedBarChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      barGap={2}
                      barCategoryGap="15%"
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1f5f9"
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis
                        type="number"
                        tick={{ fill: "#64748b", fontSize: 12 }}
                        axisLine={{ stroke: "#e2e8f0" }}
                        tickLine={{ stroke: "#e2e8f0" }}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={100}
                        tick={{
                          fill: "#475569",
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                        axisLine={{ stroke: "#e2e8f0" }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.98)",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          padding: "12px",
                        }}
                        labelStyle={{
                          color: "#1e293b",
                          fontWeight: 600,
                          marginBottom: "4px",
                        }}
                        itemStyle={{
                          color: "#475569",
                          fontSize: "13px",
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          paddingTop: "20px",
                        }}
                        iconType="circle"
                        iconSize={8}
                      />
                      {daysOfWeek.map((day: string, index: number) => (
                        <Bar
                          key={day}
                          dataKey={day}
                          fill={barColors[index % barColors.length]}
                          radius={[0, 4, 4, 0]}
                          maxBarSize={32}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card className="border-2 border-transparent hover:border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-green-600" />
              Today's Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyStandings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Trophy className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No submissions today yet.</p>
                </div>
              ) : (
                dailyStandings.map((user, index) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 shadow-md transition-all duration-300 bg-white/80 border-green-100 hover:border-green-300
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                          index === 0
                            ? "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-400 "
                            : "bg-gradient-to-br from-gray-400 via-gray-600 to-gray-500"
                        }`}
                      >
                        {index + 1}
                      </motion.div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Adm No: {user.admNo} | Year: {user.year}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">
                        {user.totalMinutes} mins
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.submissionsCount} submissions
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card className="border-2 border-transparent hover:border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Overall Standings Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overallStandings.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No overall standings available yet.</p>
                </div>
              ) : (
                overallStandings.map((user, index) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 shadow-md transition-all duration-300 bg-white/80 border-green-100 hover:border-green-300
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${
                          index === 0
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                            : "bg-gradient-to-br from-gray-400 via-gray-600 to-gray-500"
                        }`}
                      >
                        {index + 1}
                      </motion.div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Adm No: {user.admNo} | Year: {user.year}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 text-lg">
                        {user.totalMinutes} mins
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.submissionsCount} submissions
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
              <TrendingUp className="w-5 h-5 text-gray-600" />
              Overall Standings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overallStandings.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No data available for overall standings.</p>
              </div>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 300 + overallStandings.length * 40,
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={overallStandings}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    barCategoryGap="15%"
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={{ stroke: "#e2e8f0" }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={100}
                      interval={0}
                      tick={{ fill: "#475569", fontSize: 13, fontWeight: 500 }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900 mb-2">
                                {label}
                              </p>
                              <p className="text-emerald-600 font-medium mb-1">
                                Total Screen Time: {data.totalMinutes} mins
                              </p>
                              <p className="text-sm text-gray-600">
                                Adm No: {data.admNo} | Submissions:{" "}
                                {data.submissionsCount}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="totalMinutes"
                      fill="url(#colorGradient)"
                      radius={[0, 6, 6, 0]}
                      maxBarSize={40}
                    />
                    <defs>
                      <linearGradient
                        id="colorGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop
                          offset="0%"
                          stopColor="#10b981"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="#059669"
                          stopOpacity={0.9}
                        />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
