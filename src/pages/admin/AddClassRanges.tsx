import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { GlobalLoader } from "@/components/ui/global-loader";
import { AssessmentClassRangeDTO } from "@/types/assessment_class_range";
import { ClassRangeApiService } from "@/services/AssessmentClassRangeApiService";

const AddClassRanges = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [ranges, setRanges] = useState<AssessmentClassRangeDTO[]>([
    { label: "Normal", min_score: 0, max_score: 10, recommendation: "Continue maintaining a healthy lifestyle." }
  ]);

  const addRangeRow = () => {
    const lastMax = ranges[ranges.length - 1]?.max_score || 0;
    setRanges([...ranges, { 
      label: "", 
      min_score: lastMax + 1, 
      max_score: lastMax + 10, 
      recommendation: "" 
    }]);
  };

  const removeRangeRow = (index: number) => {
    if (ranges.length > 1) {
      setRanges(ranges.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!assessmentId) return;
    
    // Simple Validation: Ensure max > min
    const isValid = ranges.every(r => r.max_score > r.min_score && r.label.trim() !== "");
    if (!isValid) {
      toast.error("Validation Error", { description: "Please ensure all labels are filled and max scores are greater than min scores." });
      return;
    }

    setIsSaving(true);
    try {
      const res = await ClassRangeApiService.addAll(assessmentId, ranges);
      if (res.status_code === 201 || res.status_code === 200) {
        toast.success("Scoring Ranges Saved", { description: "Now, let's add the questions." });
        
        // FINAL STEP: Redirect to Questions
        navigate(`/admin/assessments/${assessmentId}/questions`);
      }
    } catch (error: any) {
      toast.error("Save Failed", { description: error.response?.data?.detail || "Error saving ranges." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {isSaving && <GlobalLoader message="Configuring scoring interpretation..." />}
      
      <div className="pt-24 max-w-5xl mx-auto px-6 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-slate-900">Step 3: Scoring Ranges</h1>
          <p className="text-slate-500">Define how the total score translates into diagnostic labels.</p>
        </div>

        <div className="space-y-6">
          {ranges.map((range, i) => (
            <Card key={i} className="border-none shadow-md animate-in fade-in slide-in-from-bottom-4">
              <CardContent className="p-6">
                <div className="grid grid-cols-12 gap-4 items-start">
                  {/* Label & Scores */}
                  <div className="col-span-12 md:col-span-4 space-y-3">
                    <Input 
                      placeholder="Label (e.g. Severe Depression)" 
                      value={range.label}
                      onChange={(e) => {
                        const newRanges = [...ranges];
                        newRanges[i].label = e.target.value;
                        setRanges(newRanges);
                      }}
                      className="font-semibold"
                    />
                    <div className="flex gap-2 items-center">
                      <Input 
                        type="number" 
                        placeholder="Min" 
                        value={range.min_score}
                        onChange={(e) => {
                          const newRanges = [...ranges];
                          newRanges[i].min_score = parseInt(e.target.value);
                          setRanges(newRanges);
                        }}
                      />
                      <span className="text-slate-400">to</span>
                      <Input 
                        type="number" 
                        placeholder="Max" 
                        value={range.max_score}
                        onChange={(e) => {
                          const newRanges = [...ranges];
                          newRanges[i].max_score = parseInt(e.target.value);
                          setRanges(newRanges);
                        }}
                      />
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="col-span-12 md:col-span-7">
                    <Textarea 
                      placeholder="Clinical recommendation or next steps for this range..." 
                      className="min-h-[90px] bg-slate-50/50"
                      value={range.recommendation}
                      onChange={(e) => {
                        const newRanges = [...ranges];
                        newRanges[i].recommendation = e.target.value;
                        setRanges(newRanges);
                      }}
                    />
                  </div>

                  {/* Delete Action */}
                  <div className="col-span-12 md:col-span-1 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:text-coral text-slate-300"
                      onClick={() => removeRangeRow(i)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex justify-between items-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <Button variant="outline" onClick={addRangeRow} className="gap-2 border-primary text-primary hover:bg-primary/5">
            <Plus className="w-4 h-4" /> Add New Range
          </Button>
          
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 px-10 gap-2 shadow-lg shadow-primary/20">
            Confirm Ranges <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddClassRanges;