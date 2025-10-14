import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  LogOut,
  Shield,
  Users,
  Trophy,
  BarChart3,
  Menu,
  X,
  User,
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
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
  const [activeTab, setActiveTab] = useState<ActiveTab>("users");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [dailyStandings, setDailyStandings] = useState<StandingData[]>([]);
  const [overallStandings, setOverallStandings] = useState<StandingData[]>([]);
  const [weeklyData, setWeeklyData] = useState<any>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
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
      if (overallRes.success) setOverallStandings(overallRes.data);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "users"
                  ? "bg-green-100 text-green-700 border-r-2 border-green-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Users className="w-5 h-5" />
              Total Users
            </button>
            <button
              onClick={() => setActiveTab("standings")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === "standings"
                  ? "bg-green-100 text-green-700 border-r-2 border-green-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Trophy className="w-5 h-5" />
              Standings
            </button>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === "users" ? "Total Users" : "Standings"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">Welcome, Admin</div>
            </div>
          </div>
        </header>

        {/* Content */}
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
              {/* Stats Cards */}
              {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Total Users
                          </p>
                          <p className="text-3xl font-bold text-gray-900">
                            {stats.totalUsers}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Active Users
                          </p>
                          <p className="text-3xl font-bold text-gray-900">
                            {stats.usersWithSubmissions}
                          </p>
                        </div>
                        <User className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Total Submissions
                          </p>
                          <p className="text-3xl font-bold text-gray-900">
                            {stats.totalSubmissions}
                          </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-purple-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Today's Submissions
                          </p>
                          <p className="text-3xl font-bold text-gray-900">
                            {stats.todaySubmissions}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Tab Content */}
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
    </div>
  );
}

// Users View Component
function UsersView({ users }: { users: UserData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          All Registered Users
        </CardTitle>
        <CardDescription>
          Complete list of all registered users and their data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
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
              {users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
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
                    {(user.totalScreenTime / 60).toFixed(1)}h
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {user.screenTimeSubmissions?.length || 0}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Standings View Component
function StandingsView({
  dailyStandings,
  overallStandings,
  weeklyData,
}: {
  dailyStandings: StandingData[];
  overallStandings: StandingData[];
  weeklyData: any;
}) {
  // Define colors for the line chart
  const lineColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-8">
      {/* Weekly Standings Chart */}
      {weeklyData &&
        weeklyData.chartData &&
        weeklyData.chartData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Weekly Screen Time Trends
              </CardTitle>
              <CardDescription>
                Top performers' screen time over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="day"
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
                          return (
                            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold text-gray-900 mb-2">
                                {label}
                              </p>
                              {payload.map((entry, index) => (
                                <p
                                  key={index}
                                  className="text-sm"
                                  style={{ color: entry.color }}
                                >
                                  {entry.dataKey}: {entry.value}h
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {weeklyData.users.map((user: any, index: number) => (
                      <Line
                        key={user.name}
                        type="monotone"
                        dataKey={user.name}
                        stroke={lineColors[index % lineColors.length]}
                        strokeWidth={3}
                        dot={{
                          fill: lineColors[index % lineColors.length],
                          strokeWidth: 2,
                          r: 4,
                        }}
                        activeDot={{
                          r: 6,
                          stroke: lineColors[index % lineColors.length],
                          strokeWidth: 2,
                        }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Daily Standings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Today's Standings
          </CardTitle>
          <CardDescription>
            Users ranked by least screen time today
          </CardDescription>
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    index === 0
                      ? "bg-yellow-50 border-yellow-200"
                      : index === 1
                      ? "bg-gray-50 border-gray-200"
                      : index === 2
                      ? "bg-orange-50 border-orange-200"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : index === 2
                          ? "bg-orange-500"
                          : "bg-blue-500"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">
                        Adm No: {user.admNo} | Year: {user.year}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {user.totalHours}h
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

      {/* Overall Standings Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Overall Standings Chart
          </CardTitle>
          <CardDescription>
            Total screen time comparison across all users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {overallStandings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No data available for overall standings.</p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overallStandings.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={100}
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
                        return (
                          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                            <p className="font-semibold text-gray-900 mb-1">
                              {label}
                            </p>
                            <p className="text-blue-600 font-medium">
                              Total Screen Time: {data.totalHours}h
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
                  <Line
                    type="monotone"
                    dataKey="totalHours"
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
    </div>
  );
}
