import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AssessmentApiService } from "@/services/AssessmentApiService";
import { GlobalLoader } from "@/components/ui/global-loader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mic, ClipboardList, Clock, ArrowRight, Lock } from "lucide-react";
import { AssessmentDiscoveryDrawer } from "../../components/AssessmentDiscoverDrawer";
import { toast } from "sonner";

const Assessments = () => {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState<any>(null);
  
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  // if not authenticated move to login page
  if(!isLoggedIn) {
    navigate("/login");
  }

  useEffect(() => {
    const loadTests = async () => {
      try {
        const res = await AssessmentApiService.getAll();
        // console.log("Fetched Assessments:", res.data);
        if (res.status_code === 200){
            setAssessments(res.data);

        }
        else {
            toast.error("Failed to load assessments", { description: res.message || "Please try again later." });
        }
      } catch (err) {
        toast.error("Connection Error", { description: "Failed to load assessments." });
      } finally { setLoading(false); }
    };
    loadTests();
  }, []);

  if (loading) return <GlobalLoader message="Opening Clinical Library..." />;

  

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
      <div className="mb-12 text-center">
        <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em] mb-3">Diagnostic Suite</h2>
        <h1 className="text-4xl md:text-5xl font-serif text-slate-900">Mental Wellness Screenings</h1>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
          Explore our range of validated clinical tools and innovative AI voice analysis designed to help you understand your emotional well-being.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {assessments.map((test) => (
          <Card key={test.id} className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-slate-100 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-primary/10 transition-colors">
                  {test.category_type?.toLowerCase().includes("voice") ? 
                    <Mic className="text-primary w-6 h-6" /> : 
                    <ClipboardList className="text-slate-600 w-6 h-6" />
                  }
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-mono">
                  {test.category_type}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-serif text-slate-800">{test.name}</CardTitle>
              <CardDescription className="line-clamp-2 mt-2 leading-relaxed">
                {test.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button 
                variant="ghost" 
                className="w-full justify-between group-hover:text-primary transition-colors border-t border-slate-50 pt-6 mt-2"
                onClick={() => setSelectedTest(test)}
              >
                Learn More & Instructions <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* The Discovery Drawer handles the logic of starting the test */}
      <AssessmentDiscoveryDrawer 
        test={selectedTest} 
        isOpen={!!selectedTest} 
        onClose={() => setSelectedTest(null)}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
};

export default Assessments;