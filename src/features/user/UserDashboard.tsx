import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, History, Brain, ArrowUpRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

const UserDashboard = () => {
  // Mock data for the "Attempt History"
  const history = [
    { id: 1, date: "2026-03-28", emotion: "Calm", score: 85, duration: "2m 30s" },
    { id: 2, date: "2026-03-25", emotion: "Anxious", score: 42, duration: "1m 45s" },
    { id: 3, date: "2026-03-22", emotion: "Happy", score: 92, duration: "3m 10s" },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-serif text-foreground">Welcome back, Shahid</h1>
        <p className="text-muted-foreground mt-2">Here is a summary of your recent emotional wellness checks.</p>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <h3 className="text-2xl font-bold">24</h3>
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
                <h3 className="text-2xl font-bold">78%</h3>
              </div>
              <div className="p-3 bg-coral/10 rounded-full text-coral">
                <Activity className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-coral text-white shadow-lg hover:scale-[1.02] transition-transform cursor-pointer">
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-sm uppercase">
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Primary Emotion</th>
                  <th className="pb-4 font-medium">Confidence</th>
                  <th className="pb-4 font-medium">Duration</th>
                  <th className="pb-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="py-4 text-sm">{item.date}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.emotion === 'Calm' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {item.emotion}
                      </span>
                    </td>
                    <td className="py-4 text-sm font-medium">{item.score}%</td>
                    <td className="py-4 text-sm text-muted-foreground">{item.duration}</td>
                    <td className="py-4 text-right">
                      <Button variant="ghost" size="sm"><ArrowUpRight className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;