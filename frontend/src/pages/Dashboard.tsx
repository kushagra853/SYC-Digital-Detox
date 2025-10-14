import React, { useState, useEffect, useMemo } from "react";
import ImageUpload from "../components/ImageUpload";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  BarChart,
  CalendarDays,
  TrendingDown,
  TrendingUp,
  Hourglass,
} from "lucide-react";

interface Upload {
  id: string;
  date: string;
  screenTime: number;
}

interface User {
  id: string;
  name: string;
  uploads: Upload[];
}

type StatCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  value: React.ReactNode;
  unit?: string;
  color?: string;
};

function StatCard({ icon: Icon, title, value, unit, color }: StatCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.05, y: -5 }}>
      <Card
        className="shadow-md hover:shadow-lg transition-shadow border-l-4"
        style={{ borderLeftColor: color }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-gray-500">{unit}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ScreenTimeChart({ uploads }: { uploads: Upload[] }) {
  const sortedUploads = useMemo(
    () =>
      [...uploads].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [uploads]
  );

  const maxScreenTime = useMemo(
    () => Math.max(...sortedUploads.map((u) => u.screenTime), 0) || 10,
    [sortedUploads]
  );

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Screen Time History
        </CardTitle>
        <CardDescription>
          Your daily screen time progress over the last entries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedUploads.length > 0 ? (
          <div className="flex h-64 items-end gap-3 sm:gap-4 border-l border-b border-gray-200 pl-4 pb-2">
            {sortedUploads.map((upload) => (
              <div
                key={upload.id}
                className="group relative flex-1"
                title={`${new Date(upload.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}: ${upload.screenTime} hrs`}
              >
                <motion.div
                  initial={{ height: "0%" }}
                  animate={{
                    height: `${(upload.screenTime / maxScreenTime) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="w-full bg-gradient-to-t from-green-400 to-emerald-500 rounded-t-md group-hover:from-green-500 group-hover:to-emerald-600"
                ></motion.div>
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500">
                  {new Date(upload.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-gray-500 text-center">
            <BarChart className="w-12 h-12 mb-2 opacity-50" />
            <p>No data yet.</p>
            <p className="text-sm">Upload a report to see your chart.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  // 2. Add types to your useState hooks
  const [user, setUser] = useState<User | null>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);

  const refreshDashboardData = () => {
    // Cast the parsed object to ensure type safety
    const currentUser = JSON.parse(
      localStorage.getItem("digitalDetoxUser") || "{}"
    ) as User;
    if (currentUser && currentUser.uploads) {
      setUploads(currentUser.uploads);
    }
  };

  useEffect(() => {
    let currentUser = JSON.parse(
      localStorage.getItem("digitalDetoxUser") ?? "null"
    ) as User | null;

    if (!currentUser) {
      const defaultUser: User = {
        id: "default-user-1",
        name: "User",
        uploads: [],
      };
      const allUsers = [defaultUser];
      localStorage.setItem("digitalDetoxUsers", JSON.stringify(allUsers));
      localStorage.setItem("digitalDetoxUser", JSON.stringify(defaultUser));
      currentUser = defaultUser;
    }

    setUser(currentUser);
    setUploads(currentUser?.uploads || []);
  }, []);

  const stats = useMemo(() => {
    if (uploads.length === 0) {
      return {
        average: "N/A",
        highest: "N/A",
        lowest: "N/A",
      };
    }
    const screenTimes = uploads.map((u) => u.screenTime);
    const total = screenTimes.reduce((sum, time) => sum + time, 0);
    return {
      average: (total / uploads.length).toFixed(1),
      highest: Math.max(...screenTimes).toFixed(1),
      lowest: Math.min(...screenTimes).toFixed(1),
    };
  }, [uploads]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-green-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-800">
            Digital Wellbeing Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome back, {user.name}! Here's your progress overview.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats and Chart */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <StatCard
                icon={CalendarDays}
                title="Days Tracked"
                value={uploads.length}
                unit="Total entries"
                color="#34d399"
              />
              <StatCard
                icon={Hourglass}
                title="Avg. Screen Time"
                value={stats.average}
                unit="Hours / Day"
                color="#f59e0b"
              />
              <StatCard
                icon={TrendingUp}
                title="Highest Daily"
                value={stats.highest}
                unit="Hours"
                color="#ef4444"
              />
              <StatCard
                icon={TrendingDown}
                title="Lowest Daily"
                value={stats.lowest}
                unit="Hours"
                color="#10b981"
              />
            </div>

            <ScreenTimeChart uploads={uploads} />
          </div>

          <div className="lg:col-span-1">
            <ImageUpload user={user} onUploadComplete={refreshDashboardData} />
          </div>
        </div>
      </div>
    </div>
  );
}
