import { 
  Users, 
  FileText, 
  Settings, 
  Activity, 
  Search, 
  ArrowRight, 
  ClipboardCheck,
  AlertCircle, 
  BarChart3 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const managementModules = [
    {
      title: "User Management",
      desc: "Manage student accounts and view history.",
      icon: Users,
      path: "/admin/users",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      title: "Assessments",
      desc: "Configure questions, categories, and ranges.",
      icon: ClipboardCheck,
      path: "/admin/assessments",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      title: "Analytics & Reports",
      desc: "Detailed wellness trends and system exports.",
      icon: BarChart3,
      path: "/admin/reports",
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      title: "System Logs",
      desc: "Monitor API performance and errors.",
      icon: Activity,
      path: "/admin/logs",
      color: "text-coral",
      bg: "bg-coral/10"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif text-slate-900">Admin Control Center</h1>
            <p className="text-slate-500">Global overview of MindfulAI platform operations.</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input className="pl-10 bg-white border-none shadow-sm" placeholder="Search modules..." />
          </div>
        </div>

        {/* Real-time System Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "API Uptime", value: "99.9%", icon: Activity, color: "text-emerald-600" },
            { label: "Active Sessions", value: "42", icon: Users, color: "text-blue-600" },
            { label: "Storage Used", value: "12.4 GB", icon: FileText, color: "text-purple-600" },
            { label: "Critical Alerts", value: "0", icon: AlertCircle, color: "text-coral" },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Grid */}
        <h2 className="text-xl font-semibold mb-6 text-slate-800">Management Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {managementModules.map((module, i) => (
            <Card 
              key={i} 
              className="group border-none shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => navigate(module.path)}
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${module.bg} ${module.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <module.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
                <CardDescription>{module.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="p-0 text-primary group-hover:translate-x-1 transition-transform">
                  Access Module <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Health Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader>
              <CardTitle>API Latency Analysis</CardTitle>
              <CardDescription>Real-time performance across global endpoints.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex flex-col items-center justify-center bg-slate-50/50 rounded-b-xl border-t border-slate-100">
               {/* Visual placeholder for a real chart */}
               <div className="w-full h-full flex items-end justify-around px-10 pb-4">
                  {[40, 70, 45, 90, 65, 80, 30].map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} className="w-8 bg-primary/20 rounded-t-sm border-t-2 border-primary" />
                  ))}
               </div>
               <p className="text-xs text-slate-400 mt-4 font-mono">Last updated: {new Date().toLocaleTimeString()}</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle>Recent Admin Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { action: "Updated Depression Category", time: "10m ago" },
                  { action: "Deleted User Test_99", time: "2h ago" },
                  { action: "Generated Monthly Report", time: "5h ago" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-coral" />
                    <div>
                      <p className="text-sm font-medium text-slate-800">{item.action}</p>
                      <p className="text-xs text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;