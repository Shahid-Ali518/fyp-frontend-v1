import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, History, Brain, ArrowUpRight, PlayCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserApiService } from "@/services/UserApiService";
import { UserHistoryDTO } from "@/types/user";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserHistoryDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await UserApiService.getSelfProfileHistory();
        if (response.data) {
          setProfileData(response.data);
        }
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Failed to fetch profile history record.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Loading dynamic profile history metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Data Sync Failure</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats from real history array
  const testAttempts = profileData?.test_attempts || [];
  const totalSessions = testAttempts.length;
  
  const avgWellnessScore = totalSessions > 0 
    ? Math.round(testAttempts.reduce((acc, curr) => acc + (curr.test_score || 0), 0) / totalSessions)
    : 0;

  // Helper badge color assignment engine based on state evaluation
  const getEmotionBadgeColor = (state: string) => {
    switch (state?.toLowerCase()) {
      case "calm":
      case "happy":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "anxious":
      case "stressed":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-serif text-foreground">
          Welcome back, {profileData?.name || "User"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Here is a summary of your recent emotional wellness checks.
        </p>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <h3 className="text-2xl font-bold">{totalSessions}</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Brain className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-coral shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Wellness Score</p>
                <h3 className="text-2xl font-bold">{avgWellnessScore}%</h3>
              </div>
              <div className="p-3 bg-coral/10 rounded-full text-coral">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          onClick={() => navigate("/assessments")} 
          className="bg-coral text-white shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
        >
          <CardContent className="pt-6 flex flex-col items-center justify-center text-center h-full">
            <PlayCircle className="w-10 h-10 mb-2" />
            <h3 className="text-lg font-bold">Start New Session</h3>
            <p className="text-xs opacity-90">Analyze your current mood</p>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Attempt History</CardTitle>
            <CardDescription>Your last voice-based emotion analyses</CardDescription>
          </div>
          <Button variant="ghost" className="text-primary text-sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {testAttempts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No session attempts logged yet. Select "Start New Session" to log your first audio analysis.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-sm uppercase">
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium">Primary Emotion</th>
                    <th className="pb-4 font-medium">Confidence Score</th>
                    <th className="pb-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {testAttempts.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4 text-sm">
                        {new Date(item.attempt_date).toLocaleDateString("en-US", {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getEmotionBadgeColor(item.test_state)}`}>
                          {item.test_state || "Unknown"}
                        </span>
                      </td>
                      <td className="py-4 text-sm font-medium">{item.test_score}%</td>
                      <td className="py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/assessments/results/${item.id}`)}
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;