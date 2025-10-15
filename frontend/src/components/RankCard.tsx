import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { getUserRank } from "../api";
interface RankCardProps {
  user: any;
}

export default function RankCard({ user }: RankCardProps) {
  const [rank, setRank] = useState<number | null>(null);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);

  useEffect(() => {
    if (user?.id) {
      fetchRank();
    }
  }, [user]);

  const fetchRank = async () => {
    try {
      const response = await getUserRank(user.id);
      if (response.success) {
        setRank(response.data.rank);
        setTotalParticipants(response.data.totalParticipants);
      }
    } catch (error) {
      console.error("Error fetching rank:", error);
    }
  };

  const getRankSuffix = (r: number) => {
    if (r % 100 >= 11 && r % 100 <= 13) return "th";
    switch (r % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-medium mb-1">
                Your Rank
              </p>
              {rank !== null ? (
                <p className="text-2xl font-semibold text-gray-800">
                  {rank}
                  <sup className="text-lg font-medium">
                    {getRankSuffix(rank)}
                  </sup>
                  <span className="text-sm font-normal text-gray-500">
                    {" "}
                    / {totalParticipants}
                  </span>
                </p>
              ) : (
                <p className="text-2xl font-semibold text-gray-400">
                  Loading...
                </p>
              )}
            </div>
            <div className="w-11 h-11 bg-green-50 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
