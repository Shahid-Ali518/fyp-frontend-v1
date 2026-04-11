import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { AssessmentAttemptApiService } from "@/services/AssessmentAttemptApiService";
import { GlobalLoader } from "@/components/ui/global-loader";
import { ReportApiService } from "@/services/ReportApiService";

const AssessmentResult = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await AssessmentAttemptApiService.getTestAttemptById(attemptId!);
                if (res.status_code === 200) {
                    setResult(res.data);
                }
            } catch (err) {
                toast.error("Could not retrieve result.");
                navigate("/dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchResult();
    }, [attemptId, navigate]);

    // PDF Download Handler
    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await ReportApiService.downloadReportPDF(attemptId!);
            toast.success("Report downloaded successfully");
        } catch (error) {
            console.error("PDF Error:", error);
            toast.error("Failed to generate PDF report.");
        } finally {
            setIsDownloading(false);
        }
    };

    // Handle loading state to prevent crashes
    if (loading) return <GlobalLoader message="Fetching your results..." />;
    if (!result) return <div className="text-center pt-20">Result not found.</div>;

    return (
        <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
            <Card className="border-none shadow-2xl overflow-hidden rounded-[2rem]">
                {/* Top Header Section */}
                <div className="bg-primary p-12 text-center text-white">
                    <h1 className="text-4xl font-serif mb-2">{result.category.name}</h1>
                    <p className="opacity-80 italic text-sm">{result.category.description}</p>
                </div>

                <CardContent className="p-12 text-center">
                    <div className="mb-10">
                        <span className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold">
                            Analysis Conclusion
                        </span>
                        <h2 className="text-6xl font-bold text-slate-900 mt-4 tracking-tight">
                            {result.state}
                        </h2>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-[1.5rem] border border-slate-100 mb-10">
                        <p className="text-slate-600 leading-relaxed text-lg">
                            Our AI analysis indicates a <strong>{result.test_state}</strong> status
                            regarding your recent <strong>{result.category.name}</strong> assessment.
                            Your calculated wellness score is <strong>{result.test_score}</strong>.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="rounded-full px-8 h-14"
                            onClick={() => navigate("/dashboard")}
                        >
                            Return to Dashboard
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full px-8 h-14"
                            onClick={handleDownload}
                            disabled={isDownloading}
                        >
                            {isDownloading ? "Generating..." : "Save as PDF"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AssessmentResult;