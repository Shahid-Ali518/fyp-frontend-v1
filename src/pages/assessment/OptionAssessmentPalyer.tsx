import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AssessmentApiService } from "@/services/AssessmentApiService";
import { AssessmentAttemptApiService } from "@/services/AssessmentAttemptApiService";
import { GlobalLoader } from "@/components/ui/global-loader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import OptionInput from "../../components/OptionInput";
import VoiceInput from "../../components/VoiceInput";
import AudioQuestionPlayer from "../../components/QuestionAudioPalyer";
import { EmotionDetectionApiService } from "@/services/EmotionDetectionApiService";

const OptionAssessmentPlayer = () => {
  const { assessmentId } = useParams();
  const { attemptId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false); // New state for AI loading

  useEffect(() => {
    const loadFullTest = async () => {
      try {
        const res = await AssessmentApiService.getDetailedById(assessmentId!);
        setTest(res.data);
      } catch (err) {
        toast.error("Could not load assessment.");
        navigate("/services");
      } finally {
        setLoading(false);
      }
    };
    loadFullTest();
  }, [assessmentId, navigate]);

  const currentQuestion = test?.questions[currentIndex];
  const progress = ((currentIndex + 1) / (test?.questions.length || 1)) * 100;
  const isVoiceCategory = test?.category_type === "audio_based";


  // console.log("Is Voice Category:", isVoiceCategory);



  const handleNext = () => {
    if (currentIndex < test.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      submitAssessment();
    }
  };

  const handleVoiceUpload = async (blob: Blob) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      // Ensure we use .wav to match the Blob type
      const audioFile = new File([blob], "recording.wav", { type: "audio/wav" });

      formData.append("attempt_id", attemptId!);
      formData.append("question_id", currentQuestion?.id);
      formData.append("file", audioFile);

      const response = await EmotionDetectionApiService.predictEmotion(formData);

      if (response.status_code === 200) {
        toast.success("Analysis complete");
        // Mark as answered
        setAnswers((prev) => ({ ...prev, [currentQuestion?.id]: true }));
        // Move to next question
        handleNext();
      }
    } catch (err) {
      toast.error("Analysis failed. Check your connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const submitAssessment = async () => {
    let finalAttemptId = attemptId;
    setLoading(true);
    try {

      if (isVoiceCategory) {
        // 4. Trigger the final calculation method on backend
        const res = await AssessmentAttemptApiService.takeAudioBasedAssessment(attemptId!);
        if (res.status_code === 201) {
          finalAttemptId = res.data.id;
          toast.success("Assessment Complete");
          navigate(`/assessment/results/${finalAttemptId}`);
          setLoading(false);
          return;
        }
      } else {
        /** * OPTION FLOW: 
         * Standard payload submission
         */
        const formattedAnswers = Object.entries(answers).map(([qId, oId]) => ({
          question_id: qId,
          option_id: oId,
        }));

        const payload = {
          category_id: assessmentId,
          answers: formattedAnswers,
        };

        const res = await AssessmentAttemptApiService.takeOptionBasedAssessment(payload);
        console.log("Submission Response:", res);

        if (res.status_code === 201) {
          finalAttemptId = res.data.id;
          toast.success("Assessment Complete");
          navigate(`/assessment/results/${finalAttemptId}`);
          setLoading(false);
          return;
        }
        else {
          // Handle cases where status is 400, 404, 500 etc if not caught by axios
          toast.error(res.message || "Submission failed");
        }
      }

    } catch (err: any) {
      // If Axios gets a 404, it comes here.
      console.error("Submission Error:", err);
      toast.error("Network Error", {
        description: err.response?.data?.detail || "Could not reach the server."
      });
    } finally {
      // This ALWAYS runs, ensuring the spinner stops
      setLoading(false);
    }
  };

  if (loading) return <GlobalLoader message="Analyzing responses..." />;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600">
            <ChevronLeft className="w-4 h-4 mr-1" /> Exit
          </Button>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Question {currentIndex + 1} of {test.questions.length}
            </span>
            <Progress value={progress} className="w-32 h-1.5 mt-2" />
          </div>
        </div>

        <AnimatePresence mode="wait"
          onExitComplete={() => {
            // This is the "Nuclear Option"
            // It finds any stray tracks and kills them after the animation ends
            navigator.mediaDevices.getUserMedia({ audio: true })
              .then(stream => stream.getTracks().forEach(track => track.stop()))
              .catch(() => { }); // Ignore if already closed
          }}
        >
          <motion.div
            key={currentIndex}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            className="bg-white rounded-[2rem] p-10 shadow-xl min-h-[450px] flex flex-col border border-white"
          >
            <div className="flex items-start justify-between gap-6 mb-12">
              <h2 className="text-2xl md:text-3xl font-serif text-slate-800">
                {currentQuestion?.text}
              </h2>
              <AudioQuestionPlayer questionId={currentQuestion?.id} />
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {isVoiceCategory ? (
                <VoiceInput
                  key={`voice-${currentIndex}`} // Unique key per question
                  onUpload={handleVoiceUpload}
                />
              ) : (
                <OptionInput
                  options={test.options}
                  selectedId={answers[currentQuestion?.id]}
                  onSelect={(id) => setAnswers({ ...answers, [currentQuestion?.id]: id })}
                />
              )}
            </div>

            <div className="mt-12 flex justify-end items-center gap-6">
              <p className="text-xs text-slate-400 italic">
                {isVoiceCategory ? "Speak clearly into your mic" : "Select the best fitting option"}
              </p>
              <Button
                onClick={handleNext}
                // Disable button if no answer OR if currently uploading to AI
                disabled={!answers[currentQuestion?.id] || isAnalyzing}
                className="px-10 h-14 rounded-full gap-2 shadow-lg hover:scale-105"
              >
                {isAnalyzing ? (
                  "Analyzing..."
                ) : currentIndex === test.questions.length - 1 ? (
                  "Finish"
                ) : (
                  "Next"
                )}
                {!isAnalyzing && <ChevronRight className="w-4 h-4" />}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OptionAssessmentPlayer;