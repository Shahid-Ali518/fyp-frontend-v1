import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic, Square, Trash2, Check, Loader2,
    Brain, Activity, Info, BarChart3, RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { EmotionDetectionApiService } from "@/services/EmotionDetectionApiService";

const EmotionAnalysis = () => {
    // State
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    // Refs for Recording
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Check what the browser actually supports
            const mimeType = MediaRecorder.isTypeSupported('audio/webm')
                ? 'audio/webm'
                : 'audio/ogg';

            const recorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = recorder;
            chunks.current = [];

            recorder.ondataavailable = (e) => chunks.current.push(e.data);
            recorder.onstop = () => {
                // Use the recorder's actual mimeType (likely audio/webm)
                const blob = new Blob(chunks.current, { type: mediaRecorderRef.current.mimeType });
                setAudioBlob(blob);

                // Stop the tracks to turn off the microphone light
                stream.getTracks().forEach(track => track.stop());
            };

            recorder.start();
            setIsRecording(true);
            setAnalysisResult(null);
        } catch (err) {
            toast.error("Microphone access denied. Check browser permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleAnalysis = async () => {
        if (!audioBlob) return;
        setIsAnalyzing(true);

        try {
            const formData = new FormData();
            formData.append("file", audioBlob, "user_voice.wav");

            // Hits your FastAPI: @app.post("/predict")
            const res = await EmotionDetectionApiService.predictEmotionByModelV1(formData);

            setAnalysisResult(res.data); // result.data contains {top_emotion, probabilities}
            toast.success("Analysis Complete!");
        } catch (err) {
            toast.error("FastAPI Server unavailable or Analysis failed.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4"
                    >
                        <Brain className="w-4 h-4" />
                        WavLM + ONNX Intelligence Engine
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">Voice Emotion Insights</h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Record a short clip of your voice (3-5 seconds). Our AI will analyze the tonal frequencies to map your emotional state.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left: Recording Console */}
                    <div className="lg:col-span-7 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 min-h-[450px] flex flex-col justify-between">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-800">Voice Console</h2>
                                {isRecording && (
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                        <span className="text-red-500 text-xs font-bold uppercase tracking-tighter">Live Audio</span>
                                    </div>
                                )}
                            </div>

                            {/* Visualizer Placeholder */}
                            <div className="h-40 w-full bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                {isRecording ? (
                                    <div className="flex items-end gap-1 h-12">
                                        {[...Array(12)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: [20, 48, 20] }}
                                                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                                                className="w-2 bg-primary rounded-full"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <Activity className="w-10 h-10 text-slate-300" />
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-6">
                            <div className="flex items-center gap-4">
                                {!audioBlob ? (
                                    <Button
                                        onClick={isRecording ? stopRecording : startRecording}
                                        className={`w-20 h-20 rounded-full shadow-lg transition-all ${isRecording ? "bg-red-500 hover:bg-red-600 scale-110" : "bg-primary hover:bg-primary/90"
                                            }`}
                                    >
                                        {isRecording ? <Square className="w-8 h-8 fill-white" /> : <Mic className="w-8 h-8 text-white" />}
                                    </Button>
                                ) : (
                                    <div className="flex gap-4 animate-in zoom-in duration-300">
                                        <Button
                                            variant="outline"
                                            onClick={() => setAudioBlob(null)}
                                            className="w-16 h-16 rounded-full border-slate-200 text-slate-500"
                                        >
                                            <RotateCcw className="w-6 h-6" />
                                        </Button>
                                        <Button
                                            onClick={handleAnalysis}
                                            disabled={isAnalyzing}
                                            className="h-16 px-8 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-100"
                                        >
                                            {isAnalyzing ? <Loader2 className="animate-spin mr-2" /> : <Check className="mr-2" />}
                                            {isAnalyzing ? "Analyzing..." : "Analyze Emotion"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm font-medium text-slate-400">
                                {isRecording ? "Listening... Speak naturally" : audioBlob ? "Recording Saved" : "Click mic to start"}
                            </p>
                        </div>
                    </div>

                    {/* Right: Results Display */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 h-full min-h-[450px]">
                            <div className="flex items-center gap-2 mb-8">
                                <BarChart3 className="w-5 h-5 text-primary" />
                                <h2 className="text-xl font-bold text-slate-800">Results</h2>
                            </div>

                            {!analysisResult ? (
                                <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-full">
                                        <Info className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-400 text-sm px-10">
                                        Analysis results will appear here after you process your voice clip.
                                    </p>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center p-6 bg-primary/5 rounded-3xl border border-primary/10">
                                        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Detected Tone</p>
                                        <h3 className="text-4xl font-serif text-slate-900 capitalize">{analysisResult.top_emotion}</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {Object.entries(analysisResult.probabilities).map(([emotion, value]: any) => (
                                            <div key={emotion} className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                                    <span className="text-slate-600">{emotion}</span>
                                                    <span className="text-slate-400">{(value * 100).toFixed(1)}%</span>
                                                </div>
                                                <Progress value={value * 100} className="h-1.5 bg-slate-100" />
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmotionAnalysis;