import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "../components/ui/card";
import {
  LogOut,
  Users,
  Trophy,
  BarChart3,
  Menu,
  X,
  Award,
  Clock,
  TrendingUp,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  ChevronRight,
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
  Cell,
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
  disqualified?: boolean;
  missedSubmissions?: number;
  limitExceedCount?: number;
  consecutiveLimitExceeded?: boolean;
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
  disqualified?: boolean;
}

interface AdminStats {
  totalUsers: number;
  totalSubmissions: number;
  usersWithSubmissions: number;
  todaySubmissions: number;
  disqualifiedUsers?: number;
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

      if (usersRes.success) {
        const sortedUsers = [...usersRes.data].sort((a, b) => {
          if (a.disqualified && !b.disqualified) return 1;
          if (!a.disqualified && b.disqualified) return -1;
          return 0;
        });
        setUsers(sortedUsers);

        // Merge disqualification status into daily standings
        if (dailyRes.success) {
          const dailyWithDisqualification = dailyRes.data.map(
            (standing: StandingData) => {
              const user = usersRes.data.find(
                (u: UserData) => u._id === standing._id
              );
              return {
                ...standing,
                disqualified: user?.disqualified || false,
              };
            }
          );
          setDailyStandings(dailyWithDisqualification);
        }

        // Merge disqualification status into overall standings
        if (overallRes.success) {
          const overallWithDisqualification = overallRes.data.map(
            (standing: StandingData) => {
              const user = usersRes.data.find(
                (u: UserData) => u._id === standing._id
              );
              return {
                ...standing,
                disqualified: user?.disqualified || false,
              };
            }
          );
          const sorted = overallWithDisqualification.sort(
            (a: StandingData, b: StandingData) =>
              a.totalMinutes - b.totalMinutes
          );
          setOverallStandings(sorted);
        }

        // Merge disqualification status into weekly data
        if (weeklyRes.success) {
          const weeklyUsersWithDisqualification = weeklyRes.data.users.map(
            (weeklyUser: any) => {
              const user = usersRes.data.find(
                (u: UserData) => u._id === weeklyUser._id
              );
              return {
                ...weeklyUser,
                disqualified: user?.disqualified || false,
              };
            }
          );
          setWeeklyData({
            ...weeklyRes.data,
            users: weeklyUsersWithDisqualification,
          });
        }
      }

      if (statsRes.success) {
        const disqualifiedCount = usersRes.data.filter(
          (u: UserData) => u.disqualified
        ).length;
        setStats({
          ...statsRes.data,
          disqualifiedUsers: disqualifiedCount,
        });
      }
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
        <div className="flex items-center justify-between h-16 px-6 border-b border-green-200/50 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl mx-2 my-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 rounded-lg"
          >
            <img src="/logo.webp" alt="SYC logo" className="h-20 w-20" />
            <span className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
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
          className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-green-200/50 rounded-lg mx-4 mt-6 my-4"
        >
          <div className="flex items-center justify-between h-15.5 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-green-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
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
                      delay: 0.1,
                    },
                    {
                      label: "Today's Submissions",
                      value: stats.todaySubmissions,
                      icon: Clock,
                      color: "orange",
                      delay: 0.2,
                    },
                    {
                      label: "Disqualified Users",
                      value: stats.disqualifiedUsers || 0,
                      icon: XCircle,
                      color: "red",
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
                      <Card
                        className={`border-2 ${
                          stat.label === "Disqualified Users"
                            ? "border-red-200 hover:border-red-300"
                            : "border-transparent hover:border-green-200"
                        } shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm`}
                      >
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
                                className={`text-3xl font-semibold mt-1 ${
                                  stat.label === "Disqualified Users"
                                    ? "text-red-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {stat.value}
                              </motion.p>
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 5 }}
                              transition={{ duration: 0.3 }}
                              className={`w-12 h-12 ${
                                stat.label === "Disqualified Users"
                                  ? "bg-gradient-to-br from-red-100 to-red-200"
                                  : `bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200`
                              } rounded-xl flex items-center justify-center shadow-md`}
                            >
                              <stat.icon
                                className={`w-6 h-6 ${
                                  stat.label === "Disqualified Users"
                                    ? "text-red-600"
                                    : `text-${stat.color}-600`
                                }`}
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
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const totalPages = Math.ceil(users.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

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
                    Status
                  </th>
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
                    Limit Exceeds
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b transition-all duration-300 ${
                      user.disqualified
                        ? "bg-red-50/70 hover:bg-red-100/70 border-red-200"
                        : "hover:bg-green-50/50"
                    }`}
                  >
                    <td className="py-3 px-4">
                      {user.disqualified ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex items-center gap-1"
                        >
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold border border-red-300">
                            <XCircle className="w-3 h-3" />
                            DISQUALIFIED
                          </span>
                        </motion.div>
                      ) : user.consecutiveLimitExceeded ? (
                        <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold border border-yellow-300">
                          <AlertTriangle className="w-3 h-3" />
                          WARNING
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.admNo}</td>
                    <td className="py-3 px-4 text-gray-600">{user.year}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {user.email}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {user.whatsappNumber}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          user.disqualified
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.totalScreenTime} mins
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {user.screenTimeSubmissions?.length || 0}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          (user.limitExceedCount || 0) >= 3
                            ? "bg-red-100 text-red-700"
                            : (user.limitExceedCount || 0) >= 1
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {user.limitExceedCount || 0}/3
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>

        {totalPages > 1 && (
          <CardFooter className="flex items-center justify-between pt-4 border-t border-green-100">
            <span className="text-sm text-gray-600">
              Page{" "}
              <span className="font-semibold text-gray-800">{currentPage}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-800">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardFooter>
        )}
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
    const userData: { [key: string]: any } = {
      name: user.name,
      disqualified: user.disqualified || false,
    };
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
                {dailyStandings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No data available for today's standing.</p>
                  </div>
                ) : (
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
                        barSize={10}
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
                          width={120}
                          tick={(props) => {
                            const { x, y, payload } = props;
                            const user = groupedBarChartData.find(
                              (u: any) => u.name === payload.value
                            );
                            return (
                              <text
                                x={x}
                                y={y}
                                fill={
                                  user?.disqualified ? "#dc2626" : "#475569"
                                }
                                fontSize={13}
                                fontWeight={500}
                                textAnchor="end"
                                dy={4}
                              >
                                {payload.value}
                                {user?.disqualified && " ❌"}
                              </text>
                            );
                          }}
                          axisLine={{ stroke: "#e2e8f0" }}
                          tickLine={false}
                        />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              const userData = groupedBarChartData.find(
                                (u: any) => u.name === label
                              );
                              return (
                                <div
                                  className={`p-4 border rounded-lg shadow-lg ${
                                    userData?.disqualified
                                      ? "bg-red-50 border-red-200"
                                      : "bg-white border-gray-200"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="font-semibold text-gray-900">
                                      {label}
                                    </p>
                                    {userData?.disqualified && (
                                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold border border-red-300">
                                        <XCircle className="w-3 h-3" />
                                        DISQUALIFIED
                                      </span>
                                    )}
                                  </div>
                                  {payload.map((entry: any, index: number) => (
                                    <p
                                      key={index}
                                      className="text-sm text-gray-600"
                                      style={{ color: entry.fill }}
                                    >
                                      {entry.name}: {entry.value} mins
                                    </p>
                                  ))}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        {daysOfWeek.map((day: any, idx: number) => (
                          <Bar
                            key={day}
                            dataKey={day}
                            name={day}
                            stackId="a"
                            fill={barColors[idx % barColors.length]}
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
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
                    className={`flex items-center justify-between p-4 rounded-xl border-2 shadow-md transition-all duration-300 ${
                      user.disqualified
                        ? "bg-red-50/80 border-red-200 hover:border-red-300"
                        : "bg-white/80 border-green-100 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shadow-lg ${
                          user.disqualified
                            ? "bg-gradient-to-br from-red-400 to-red-600"
                            : index === 0
                            ? "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-400"
                            : "bg-gradient-to-br from-gray-400 via-gray-600 to-gray-500"
                        }`}
                      >
                        {user.disqualified ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          index + 1
                        )}
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">
                            {user.name}
                          </p>
                          {user.disqualified && (
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold border border-red-300">
                              <XCircle className="w-3 h-3" />
                              DISQUALIFIED
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Adm No: {user.admNo} | Year: {user.year}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold text-lg ${
                          user.disqualified ? "text-red-600" : "text-gray-900"
                        }`}
                      >
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
                    className={`flex items-center justify-between p-4 rounded-xl border-2 shadow-md transition-all duration-300 ${
                      user.disqualified
                        ? "bg-red-50/80 border-red-200 hover:border-red-300"
                        : "bg-white/80 border-green-100 hover:border-green-300"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white shadow-lg ${
                          user.disqualified
                            ? "bg-gradient-to-br from-red-400 to-red-600"
                            : index === 0
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                            : "bg-gradient-to-br from-gray-400 via-gray-600 to-gray-500"
                        }`}
                      >
                        {user.disqualified ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          index + 1
                        )}
                      </motion.div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900">
                            {user.name}
                          </p>
                          {user.disqualified && (
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold border border-red-300">
                              <XCircle className="w-3 h-3" />
                              DISQUALIFIED
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Adm No: {user.admNo} | Year: {user.year}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold text-lg ${
                          user.disqualified ? "text-red-600" : "text-gray-900"
                        }`}
                      >
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
              Overall Standings Chart
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
                      width={120}
                      interval={0}
                      tick={(props) => {
                        const { x, y, payload } = props;
                        const user = overallStandings.find(
                          (u) => u.name === payload.value
                        );
                        return (
                          <text
                            x={x}
                            y={y}
                            fill={user?.disqualified ? "#dc2626" : "#475569"}
                            fontSize={13}
                            fontWeight={500}
                            textAnchor="end"
                            dy={4}
                          >
                            {payload.value}
                            {user?.disqualified && " ❌"}
                          </text>
                        );
                      }}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div
                              className={`p-4 border rounded-lg shadow-lg ${
                                data.disqualified
                                  ? "bg-red-50 border-red-200"
                                  : "bg-white border-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <p className="font-semibold text-gray-900">
                                  {label}
                                </p>
                                {data.disqualified && (
                                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-semibold border border-red-300">
                                    <XCircle className="w-3 h-3" />
                                    DISQUALIFIED
                                  </span>
                                )}
                              </div>
                              <p
                                className={`font-medium mb-1 ${
                                  data.disqualified
                                    ? "text-red-600"
                                    : "text-emerald-600"
                                }`}
                              >
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
                      radius={[0, 6, 6, 0]}
                      maxBarSize={40}
                    >
                      {overallStandings.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.disqualified
                              ? "url(#disqualifiedGradient)"
                              : "url(#colorGradient)"
                          }
                        />
                      ))}
                    </Bar>
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
                      <linearGradient
                        id="disqualifiedGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop
                          offset="0%"
                          stopColor="#ef4444"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="#dc2626"
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
