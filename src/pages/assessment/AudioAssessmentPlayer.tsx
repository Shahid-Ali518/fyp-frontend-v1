import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AssessmentApiService } from "@/services/AssessmentApiService";
import { AssessmentAttemptApiService } from "@/services/AssessmentAttemptApiService";
import { EmotionDetectionApiService } from "@/services/EmotionDetectionApiService";
import { GlobalLoader } from "@/components/ui/global-loader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Mic, Square, Trash2, Check, XCircle, Info, Loader2 } from "lucide-react";
import AudioQuestionPlayer from "../../components/QuestionAudioPalyer";

const AudioAssessmentPlayer = () => {
  const { assessmentId, attemptId } = useParams();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await AssessmentApiService.getDetailedById(assessmentId!);
        setTest(res.data);
      } catch (err) {
        navigate("/services");
      } finally {
        setLoading(false);
      }
    };
    loadData();
    return () => forceStopHardware();
  }, [assessmentId]);

  const forceStopHardware = () => {
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current?.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  const handleExitAndCancel = async () => {
    const confirmExit = window.confirm("Exit session? This will cancel your progress and delete the current attempt.");
    if (!confirmExit) return;

    setIsExiting(true);
    try {
      forceStopHardware();
      // Calling your backend cancel API
      const res = await AssessmentAttemptApiService.cancelAttempt(attemptId!);
      if(res.status_code === 200) {
        toast.success("Session cancelled and data removed.");
        navigate("/dashboard");
      } else {
        toast.error("Failed to cancel session. Please try again.");
      }
      // toast.success("Session cancelled and data removed.");
      
    } catch (err) {
      toast.error("Error cancelling session.");
    //   navigate("/dashboard"); // Navigate anyway to safety
    } finally {
      setIsExiting(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunks.current = [];
      recorder.ondataavailable = (e) => chunks.current.push(e.data);
      recorder.onstop = () => setAudioBlob(new Blob(chunks.current, { type: "audio/wav" }));
      
      recorder.start();
      setIsRecording(true);
      setAudioBlob(null);
    } catch (err) {
      toast.error("Microphone access denied.");
    }
  };

  const handleUpload = async () => {
    if (!audioBlob) return;
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("attempt_id", attemptId!);
      formData.append("question_id", test.questions[currentIndex].id);
      formData.append("file", new File([audioBlob], "rec.wav", { type: "audio/wav" }));

      const res = await EmotionDetectionApiService.predictEmotion(formData);
      if (res.status_code === 200) {
        setAudioBlob(null);
        if (currentIndex < test.questions.length - 1) {
          setCurrentIndex(c => c + 1);
        } else {
          const finalRes = await AssessmentAttemptApiService.takeAudioBasedAssessment(attemptId!);
          navigate(`/assessment/results/${finalRes.data.id}`);
        }
      }
    } catch (e) {
      toast.error("Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) return <GlobalLoader message="Initializing interview..." />;

  const currentQuestion = test.questions[currentIndex];
  const progress = ((currentIndex + 1) / test.questions.length) * 100;

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex flex-col overflow-hidden">
      
      {/* Fixed Header */}
      <header className="h-20 flex items-center justify-between px-8 bg-white border-b border-slate-200 shrink-0">
        <Button 
          variant="ghost" 
          disabled={isExiting}
          onClick={handleExitAndCancel} 
          className="text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full font-medium"
        >
          {isExiting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
          Exit Session
        </Button>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Question {currentIndex + 1} / {test.questions.length}
          </span>
          <Progress value={progress} className="w-48 h-1.5 bg-slate-100" />
        </div>
      </header>

      {/* Main Content: Zero Scroll Layout */}
      <main className="flex-1 flex items-center justify-center p-6 overflow-hidden">
        <div className="w-full max-w-4xl h-full max-h-[650px] bg-white rounded-[2.5rem] shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          
          {/* Question Section */}
          <section className="p-10 md:p-14 bg-slate-50/40 border-b border-slate-100 flex justify-between items-start gap-10">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                Emotion Detection Engine Active
              </div>
              <h1 className="text-3xl md:text-4xl font-serif text-slate-800 leading-[1.2] tracking-tight">
                {currentQuestion?.text}
              </h1>
            </div>
            <div className="shrink-0 mt-8">
              <AudioQuestionPlayer questionId={currentQuestion?.id} />
            </div>
          </section>

          {/* Action Center */}
          <section className="flex-1 flex flex-col items-center justify-center p-8 bg-white relative">
            
            {isAnalyzing ? (
              <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
                <div className="relative h-20 w-20">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
                </div>
                <p className="text-slate-500 font-semibold text-lg">Analyzing Nuance...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-10">
                {/* Recording Control */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    {isRecording && (
                      <div className="absolute -inset-6 rounded-full bg-red-500/10 animate-pulse opacity-75" />
                    )}
                    <Button
                      onClick={isRecording ? forceStopHardware : startRecording}
                      className={`w-24 h-24 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                        isRecording 
                        ? 'bg-red-500 hover:bg-red-600 shadow-red-200' 
                        : 'bg-primary hover:bg-primary/90 shadow-primary/20'
                      }`}
                    >
                      {isRecording ? <Square className="w-8 h-8 fill-white" /> : <Mic className="w-9 h-9 text-white" />}
                    </Button>
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
                    {isRecording ? 'Recording Answer' : 'Click to start speaking'}
                  </span>
                </div>

                {/* Answer Confirmation */}
                <div className={`h-16 flex items-center transition-all duration-500 ${audioBlob && !isRecording ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                  <div className="flex items-center gap-3 p-1.5 bg-slate-50 rounded-full border border-slate-200">
                    <Button 
                      variant="ghost" 
                      onClick={() => setAudioBlob(null)}
                      className="rounded-full px-6 h-11 text-slate-500 hover:bg-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Redo
                    </Button>
                    <Button 
                      onClick={handleUpload}
                      className="rounded-full px-10 h-11 bg-green-600 hover:bg-green-700 text-white shadow-md"
                    >
                      <Check className="w-4 h-4 mr-2" /> Submit & Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Footer Bar */}
          <footer className="h-14 flex items-center justify-center bg-slate-50 border-t border-slate-100">
            <div className="flex items-center gap-2 text-slate-400">
              <Info className="w-3.5 h-3.5" />
              <p className="text-[11px] font-medium tracking-wide">
                Speak clearly and expressively for accurate emotional mapping.
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default AudioAssessmentPlayer;