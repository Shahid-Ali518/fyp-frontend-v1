import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AssessmentDTO, AssessmentType } from "@/components/types/assessment";
import { useNavigate } from "react-router-dom";
import { AssessmentApiService } from "@/components/services/AssessmentApiService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { GlobalLoader } from "@/components/ui/global-loader";

const NewAssessment = () => {
    const { register, handleSubmit, setValue } = useForm<AssessmentDTO>();
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    const onSubmit = async (data: AssessmentDTO) => {
        setLoader(true); // Start Loader
        setLoadingMessage("Creating assessment...");

        try {
            const res = await AssessmentApiService.create(data);

            // Check for your ApiResponse success flag or status code
            if (res.status_code === 201) {

                const newId = res.data?.id;
                const assess_type = res.data?.category_type;

                toast({
                    title: "Success",
                    description: `Redirecting to ${assess_type === 'audio_based' ? 'Voice' : 'Option'} configuration...`,
                    variant: "default",
                });

                // Small delay before navigation looks more organic
                setTimeout(() => {
                    if (assess_type === "audio_based") {
                        navigate(`/admin/assessments/${newId}/questions`);
                    } else if (assess_type === "option_based") {
                        navigate(`/admin/assessments/${newId}/survey-options`);
                    }

                }, 1000);
            } else {
                // Handle case where API returns 200 but success is false
                throw new Error(res.message || "Failed to create category");
            }
        } catch (error: any) {
            // Professional Error Handling
            const errorMessage = error.response?.data?.detail || error.message || "Connection lost";

            toast({
                variant: "destructive", // Coral/Red style
                title: "Creation Failed",
                description: errorMessage,
            });

            //   console.error("Submission Error:", error);
        } finally {
            setLoader(false); // Stop Loader regardless of outcome
            setLoadingMessage("");
        }
    };

    return (
        <>
        {loader && <GlobalLoader message={loadingMessage} />}
        
        <div className="pt-24 max-w-2xl mx-auto px-4">
            <Card>
                <CardHeader><CardTitle>Create Assessment Category</CardTitle></CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Category Name</label>
                            <Input {...register("name")} placeholder="e.g. Clinical Depression" required />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Type</label>
                            <Select onValueChange={(val) => setValue("category_type", val as AssessmentType)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="option_based">Option Based (Quiz)</SelectItem>
                                    <SelectItem value="audio_based">Audio Based (Voice AI)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea {...register("description")} placeholder="Purpose of this test..." />
                        </div>

                        <Button type="submit" className="w-full bg-primary">Create Category</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
        </>
    );
};


export default NewAssessment;