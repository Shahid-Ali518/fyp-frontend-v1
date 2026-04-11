import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, Plus, Info, Mic, ListChecks } from "lucide-react";
import { GlobalLoader } from "@/components/ui/global-loader";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AssessmentApiService } from "@/services/AssessmentApiService";
import { ClassRangeApiService } from "@/services/AssessmentClassRangeApiService";
import { QuestionApiService } from "@/services/QuestionApiService";
import { SurveyOptionApiService } from "@/services/SurveyOptionApiService";

// Modals
import { EditQuestionModal } from "@/pages/admin/EditQuestionModal";
import { EditOptionModal } from "@/pages/admin/EditSurveyOptionModal";
import { EditRangeModal } from "@/pages/admin/EditClassRangeModal";

const ManageAssessmentDetail = () => {
  const { assessmentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeItem, setActiveItem] = useState<{ type: 'question' | 'option' | 'range', payload: any } | null>(null);

  const isVoiceBased = data?.category_type?.toLowerCase().includes("voice");
  const isOptionBased = data?.category_type?.toLowerCase().includes("option");

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await AssessmentApiService.getDetailedById(assessmentId!);
      setData(res.data);
    } catch (err) {
      toast.error("Fetch Error", { description: "Could not sync with server." });
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDetails(); }, [assessmentId]);

  const handleDelete = async (type: string, itemId: string) => {
    if (!window.confirm(`Permanent Action: Delete this ${type}?`)) return;
    try {
      if (type === 'question') await QuestionApiService.delete(itemId);
      if (type === 'option') await SurveyOptionApiService.delete(itemId);
      if (type === 'range') await ClassRangeApiService.delete(itemId);
      
      toast.success("Removed", { description: "Item deleted successfully." });
      fetchDetails();
    } catch (err) {
      toast.error("Delete Failed", { description: "Failed to delete item." });
    }
  };

  if (loading) return <GlobalLoader message="Preparing management console..." />;

  return (
    <div className="pt-24 max-w-6xl mx-auto px-6 pb-24">
      {/* HEADER SECTION */}
      <div className="mb-10 border-b pb-8 border-slate-100 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-3">
             {isVoiceBased ? (
               <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider border border-blue-100">
                 <Mic className="w-3 h-3" /> Voice-Based Engine
               </span>
             ) : (
               <span className="bg-purple-50 text-purple-600 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider border border-purple-100">
                 <ListChecks className="w-3 h-3" /> Option-Based Scale
               </span>
             )}
          </div>
          <h1 className="text-4xl font-serif text-slate-900">{data?.name}</h1>
          <p className="text-slate-500 mt-2 max-w-2xl">{data?.description}</p>
        </div>
      </div>

      <Tabs defaultValue="questions">
        <TabsList className="mb-8 bg-slate-50 border-none p-1">
          <TabsTrigger value="questions" className="px-10">Questions</TabsTrigger>
          {isOptionBased && <TabsTrigger value="logic" className="px-10">Logic & Scoring</TabsTrigger>}
        </TabsList>

        {/* --- QUESTIONS TAB (Common to both) --- */}
        <TabsContent value="questions" className="space-y-4">
          {data?.questions?.length > 0 ? (
            data.questions.map((q: any) => (
              <div key={q.id} className="group relative bg-white border border-slate-200 p-5 rounded-xl hover:border-primary/40 hover:shadow-sm transition-all">
                <p className="text-slate-700 pr-24 font-medium">{q.text}</p>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={() => setActiveItem({type: 'question', payload: q})}><Edit3 className="w-4 h-4"/></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete('question', q.id)} className="text-coral"><Trash2 className="w-4 h-4"/></Button>
                </div>
              </div>
            ))
          ) : (
            <Alert className="bg-slate-50 border-dashed border-2">
              <Info className="h-4 w-4" />
              <AlertDescription>No questions found for this assessment. Use the "Add Question" flow to begin.</AlertDescription>
            </Alert>
          )}
        </TabsContent>

        {/* --- LOGIC TAB (Option-Based Only) --- */}
        {isOptionBased && (
          <TabsContent value="logic" className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Options Management */}
            <section className="space-y-4">
              <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em]">Response Scale</h3>
              <div className="space-y-2">
                {data?.options?.length > 0 ? data.options.map((opt: any) => (
                  <div key={opt.id} className="group flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-transparent hover:border-slate-200 transition-all">
                    <span className="text-sm font-medium text-slate-700">{opt.option_text} <span className="text-slate-400 ml-2">(Score: {opt.weightage})</span></span>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setActiveItem({type: 'option', payload: opt})}><Edit3 className="w-3.5 h-3.5"/></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-coral" onClick={() => handleDelete('option', opt.id)}><Trash2 className="w-3.5 h-3.5"/></Button>
                    </div>
                  </div>
                )) : <p className="text-xs text-slate-400 italic">No scale options configured.</p>}
              </div>
            </section>

            {/* Ranges Management */}
            <section className="space-y-4">
              <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em]">Score Interpretation</h3>
              <div className="space-y-3">
                {data?.class_ranges?.length > 0 ? data.class_ranges.map((range: any) => (
                  <div key={range.id} className="group relative border border-slate-100 p-4 rounded-xl hover:bg-slate-50/50 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{range.label}</h4>
                        <p className="text-[10px] text-slate-400 font-mono">RANGE: {range.min_score} - {range.max_score}</p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setActiveItem({type: 'range', payload: range})}><Edit3 className="w-4 h-4"/></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-coral" onClick={() => handleDelete('range', range.id)}><Trash2 className="w-4 h-4"/></Button>
                      </div>
                    </div>
                  </div>
                )) : <p className="text-xs text-slate-400 italic">No interpretation ranges configured.</p>}
              </div>
            </section>
          </TabsContent>
        )}
      </Tabs>

      {/* --- MODAL RENDERING --- */}
      {activeItem?.type === 'question' && (
        <EditQuestionModal isOpen={true} data={activeItem.payload} onClose={() => setActiveItem(null)} onSuccess={fetchDetails} />
      )}
      {activeItem?.type === 'option' && (
        <EditOptionModal isOpen={true} data={activeItem.payload} onClose={() => setActiveItem(null)} onSuccess={fetchDetails} />
      )}
      {activeItem?.type === 'range' && (
        <EditRangeModal isOpen={true} data={activeItem.payload} onClose={() => setActiveItem(null)} onSuccess={fetchDetails} />
      )}
    </div>
  );
};

export default ManageAssessmentDetail;