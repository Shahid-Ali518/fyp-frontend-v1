import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, ClipboardList, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AssessmentApiService } from "@/components/services/AssessmentApiService";
import { AssessmentDTO, AssessmentType } from "@/components/types/assessment";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { GlobalLoader } from "@/components/ui/global-loader";


const ManageAssessments = () => {
    const [assessments, setAssessments] = useState<AssessmentDTO[]>([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("");

    useEffect(() => {
        loadAssessments();
        setLoading(false);
    }, []);

    const loadAssessments = async () => {
        const res = await AssessmentApiService.getAll();
        if (res.status_code === 200) setAssessments(res.data);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure? This will remove all associated questions.")) {

            setLoadingMessage("Deleting assessment...");
            setLoading(true);
            const res = await AssessmentApiService.delete(id);
            if (res.status_code === 200) {
                toast({
                    title: "Deleted",
                    description: "Assessment category deleted successfully.",
                    variant: "default",
                });
                loadAssessments(); // Refresh list after deletion
                setLoading(false);
            } else {
                toast({
                    title: "Deletion Failed",
                    description: res.message || "Failed to delete category.",
                    variant: "destructive",
                });

            }
            loadAssessments();
        }
    };

    return (

        <>
        {loading && <GlobalLoader message={loadingMessage} />}
        <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-12 px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Assessments</h1>
                        <p className="text-slate-500">Configure clinical categories and scoring logic.</p>
                    </div>
                    <Button onClick={() => navigate("/admin/assessments/new")} className="bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" /> Add New Assessment
                    </Button>
                </div>

                <Card className="border-none shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assessments.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-semibold">{cat.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="flex w-fit items-center gap-1">
                                            {cat.category_type === AssessmentType.AUDIO_BASED ? (
                                                <Mic className="w-3 h-3 text-coral" />
                                            ) : (
                                                <ClipboardList className="w-3 h-3 text-blue-600" />
                                            )}
                                            {cat.category_type.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="max-w-xs truncate text-slate-500">
                                        {cat.description}
                                    </TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/assessments/${cat.id}`)}>
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/assessments/${cat.id}/manage`)}>
                                            <Pencil className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id!)} className="text-coral">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                </Card>

                {assessments.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-muted-foreground italic">No assessments found.</p>
                    </div>
                )}

            </div>
        </div>
        </>
    );
};

export default ManageAssessments;