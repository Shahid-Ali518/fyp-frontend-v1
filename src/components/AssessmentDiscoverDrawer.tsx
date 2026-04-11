import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ShieldCheck, AlertCircle, PlayCircle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AssessmentDiscoveryDrawer = ({ test, isOpen, onClose, isLoggedIn }: any) => {
  const navigate = useNavigate();

  const handleStart = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    // Navigate to the actual test taking page (Route to be implemented)
    navigate(`/assessment/start/${test.id}`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md flex flex-col h-full border-l-0 shadow-2xl">
        <SheetHeader className="space-y-4">
          <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20 border-none">
            {test?.category_type?.toUpperCase()} PROTOCOL
          </Badge>
          <SheetTitle className="text-3xl font-serif text-slate-900 leading-tight">
            {test?.name}
          </SheetTitle>
          <SheetDescription className="text-slate-600 text-base leading-relaxed">
            {test?.description}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-8 space-y-8">
          {/* Clinical Metadata */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-slate-50 rounded-xl">
                <Clock className="w-4 h-4 text-slate-400 mb-2"/>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Est. Time</p>
                <p className="text-sm font-semibold">5-10 Minutes</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-xl">
                <ShieldCheck className="w-4 h-4 text-slate-400 mb-2"/>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Privacy</p>
                <p className="text-sm font-semibold">Fully Encrypted</p>
             </div>
          </div>

          {/* Standard Guidelines */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" /> General Instructions
            </h4>
            <div className="text-sm text-slate-600 space-y-3 pl-6 border-l-2 border-slate-100">
              <p>• Please answer all questions based on how you have felt in the <b>past 2 weeks</b>.</p>
              <p>• Ensure you are in a quiet environment to maintain focus.</p>
              {test?.category_type?.toLowerCase().includes("voice") && (
                <p className="text-blue-600 font-medium">
                  • This test requires microphone access. You will be asked to speak naturally after the prompt.
                </p>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-[11px] text-slate-400 italic bg-slate-50 p-3 rounded-lg leading-relaxed">
            Important: This screening tool is for preliminary use only. It does not replace a professional clinical diagnosis.
          </p>
        </div>

        <SheetFooter className="mt-auto pt-6 border-t border-slate-100">
          {!isLoggedIn ? (
            <Button onClick={handleStart} className="w-full h-14 text-lg font-bold gap-2 bg-slate-900">
              <Lock className="w-5 h-5" /> Login to Start Test
            </Button>
          ) : (
            <Button onClick={handleStart} className="w-full h-14 text-lg font-bold gap-2 shadow-xl shadow-primary/20">
              <PlayCircle className="w-5 h-5" /> Begin Assessment
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};