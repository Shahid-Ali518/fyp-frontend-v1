import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Save, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { GlobalLoader } from "@/components/ui/global-loader";
import { SurveyOptionApiService } from "@/components/services/SurveyOptionApiService";
import { SurveyOptionDTO } from "@/components/types/survey_option";



const AddSurveyOptions = () => {
  const { assessmentId } = useParams(); // URL parameter from Route
  const navigate = useNavigate();
  
  const [isSaving, setIsSaving] = useState(false);
  const [options, setOptions] = useState<SurveyOptionDTO[]>([
    { option_text: "Not at all", weightage: 0 },
    { option_text: "Several days", weightage: 1 },
  ]);

  const addOptionRow = () => {
    setOptions([...options, { option_text: "", weightage: 0 }]);
  };

  const removeOptionRow = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleSaveAll = async () => {
    if (!assessmentId) return;
    
    setIsSaving(true);
    console.log(options);
    try {
      const res = await SurveyOptionApiService.addAll(assessmentId, options);
      

      if (res.status_code === 201 || res.status_code === 200) {
        toast({ title: "Configuration Saved", description: "Options and weightage registered." });
        
        // Flow Step 2: Redirect to Class Ranges
        navigate(`/admin/assessments/${assessmentId}/class-ranges`);
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Save Failed", 
        description: error.response?.data?.detail || "Could not save options." 
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {isSaving && <GlobalLoader message="Syncing weightage scales..." />}
      
      <div className="pt-24 max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-slate-900">Step 2: Define Options</h1>
          <p className="text-slate-500 font-medium">Set the scoring scale for this assessment category.</p>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Option Scale & Weightage</CardTitle>
            <CardDescription>These options will be available for every question in this category.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-4 items-center animate-in slide-in-from-left-2 duration-300">
                <div className="flex-1">
                  <Input 
                    placeholder="Option Text (e.g. Strongly Agree)" 
                    value={opt.option_text}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[i].option_text = e.target.value;
                      setOptions(newOpts);
                    }}
                  />
                </div>
                <div className="w-32">
                  <Input 
                    type="number" 
                    placeholder="Weight" 
                    value={opt.weightage}
                    onChange={(e) => {
                      const newOpts = [...options];
                      newOpts[i].weightage = parseFloat(e.target.value);
                      setOptions(newOpts);
                    }}
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-slate-400 hover:text-coral transition-colors"
                  onClick={() => removeOptionRow(i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-6">
              <Button variant="outline" onClick={addOptionRow} className="gap-2 border-2 border-dashed">
                <Plus className="w-4 h-4" /> Add Scale Level
              </Button>
              
              <Button onClick={handleSaveAll} className="bg-primary hover:bg-primary/90 px-8 gap-2">
                Save & Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AddSurveyOptions;