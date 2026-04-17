import { useState, useRef, useEffect } from "react";
import { Mic, Square, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const VoiceInput = ({ onUpload }: { onUpload: (blob: Blob) => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);

  // CRITICAL: Cleanup on unmount (when question changes)
  useEffect(() => {
    return () => {
      stopHardware();
    };
  }, []);

  const stopHardware = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        track.stop();
        track.enabled = false; // MUST HAVE THIS
      });

      // IMPORTANT: Remove the reference to the stream object entirely
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/wav" });
        setAudioBlob(blob);
      };

      recorder.start();
      setIsRecording(true);
      setAudioBlob(null);
    } catch (err) {
      console.error("Mic Error:", err);
    }
  };

  const handleStopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    stopHardware();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
        )}
        <Button
          size="lg"
          type="button"
          className={`w-24 h-24 rounded-full shadow-xl transition-all ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-primary"
            }`}
          onClick={isRecording ? handleStopClick : startRecording}
        >
          {isRecording ? <Square className="w-8 h-8 fill-white" /> : <Mic className="w-8 h-8" />}
        </Button>
      </div>

      {audioBlob && !isRecording && (
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" onClick={() => setAudioBlob(null)} className="text-destructive">
            <Trash2 className="w-4 h-4 mr-2" /> Redo
          </Button>
          <Button size="sm" onClick={() => onUpload(audioBlob)} className="bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4 mr-2" /> Use Recording
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;