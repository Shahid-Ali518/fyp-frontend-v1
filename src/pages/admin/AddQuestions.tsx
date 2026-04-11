import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, ListPlus, UploadCloud, Trash2, Save, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { QuestionApiService } from "@/services/QuestionApiService";
import { QuestionDTO } from "@/types/question";
import { GlobalLoader } from "@/components/ui/global-loader";

const AddQuestions = () => {
    const { assessmentId } = useParams(); // Category UUID
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    // State for manual questions
    const [questions, setQuestions] = useState([{ text: "", order: 1 }]);

    const addQuestionRow = () => {
        setQuestions([...questions, { text: "", order: questions.length + 1 }]);
    };

    const removeQuestionRow = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSaveManual = async () => {
        setLoadingMessage("Generating AI audio for questions...");
        setIsSaving(true);
        try {
            // Map your local state to the DTO format
            const payload: QuestionDTO[] = questions.map(q => ({
                text: q.text
            }));

            const res = await QuestionApiService.addQuestionsList(assessmentId, payload);

            // console.log(payload)
            if (res.status_code === 201) {
                toast.success("Questions Added", { description: res.message });
                navigate("/admin/assessments");
            }
        } catch (error: any) {
            toast.error("Upload Failed", { description: error.response?.data?.detail || "Something went wrong" });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoadingMessage("AI is parsing your PDF and generating voice prompts...");
        setIsSaving(true);
        try {
            const res = await QuestionApiService.uploadPdf(assessmentId!, file);
            if (res.status_code === 201) {
                toast.success("Success", { description: "Questions extracted successfully" });
                navigate("/admin/assessments");
            }
        } catch (error) {
            toast.error("Parsing Failed", { description: "Check PDF format" });
        } finally {
            setIsSaving(false);
        }
    };

    return (

        <>

            {/* GLOBAL OVERLAY */}
            {isSaving && <GlobalLoader message={loadingMessage} />}

            <div className="pt-24 max-w-5xl mx-auto px-6 pb-20">
                <div className="mb-10">
                    <h1 className="text-3xl font-serif text-slate-900">Configure Questions</h1>
                    <p className="text-slate-500">Add the prompts or items for this specific category.</p>
                </div>

                <Tabs defaultValue="manual" className="space-y-8">
                    <TabsList className="bg-slate-100 p-1 rounded-xl w-fit">
                        <TabsTrigger value="manual" className="gap-2 px-6">
                            <ListPlus className="w-4 h-4" /> Manual Entry
                        </TabsTrigger>
                        <TabsTrigger value="pdf" className="gap-2 px-6">
                            <FileText className="w-4 h-4" /> PDF Extraction
                        </TabsTrigger>
                    </TabsList>

                    {/* --- MANUAL LIST ENTRY --- */}
                    <TabsContent value="manual">
                        <Card className="border-none shadow-sm">
                            <CardHeader className="border-b border-slate-50">
                                <CardTitle className="text-lg">Question Registry</CardTitle>
                                <CardDescription>Enter each question exactly as it should appear to the user.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {questions.map((q, i) => (
                                        <div key={i} className="flex gap-4 items-start group animate-in fade-in slide-in-from-top-2">
                                            <div className="mt-3 text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
                                                Q{i + 1}
                                            </div>
                                            <textarea
                                                className="flex-1 min-h-[80px] p-4 rounded-xl border border-slate-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none"
                                                placeholder="Enter the question text..."
                                                value={q.text}
                                                onChange={(e) => {
                                                    const newQs = [...questions];
                                                    newQs[i].text = e.target.value;
                                                    setQuestions(newQs);
                                                }}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="mt-2 text-slate-300 hover:text-coral opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => removeQuestionRow(i)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 flex items-center justify-between border-t pt-6 border-slate-100">
                                    <Button variant="outline" onClick={addQuestionRow} className="border-dashed border-2 px-8">
                                        + Add Question Row
                                    </Button>
                                    <Button onClick={() => handleSaveManual()} disabled={isSaving} className="bg-primary px-10">
                                        {isSaving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                                        Finish & Save
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- PDF UPLOAD --- */}
                    <TabsContent value="pdf">
                        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
                            <CardContent className="flex flex-col items-center py-16">
                                <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                                    <UploadCloud className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Assessment PDF</h3>
                                <p className="text-slate-500 text-center max-w-sm mb-8">
                                    Our AI parser will automatically extract the questions. Ensure the file is text-readable.
                                </p>

                                <input
                                    type="file"
                                    id="pdf-input"
                                    className="hidden"
                                    accept="application/pdf"
                                    onChange={handlePdfUpload}
                                />
                                <Button asChild size="lg" className="px-12 bg-slate-900">
                                    <label htmlFor="pdf-input" className="cursor-pointer">
                                        Select Document
                                    </label>
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

        </>
    );
};

export default AddQuestions;