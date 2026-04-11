import { useState, useRef } from "react";
import { Mic, Square, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceInputProps {
  onUpload: (blob: Blob) => void;
}

export const VoiceInput = ({ onUpload }: VoiceInputProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    chunks.current = [];

    mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
    mediaRecorder.current.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      setAudioBlob(blob);
    };

    mediaRecorder.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {isRecording && (
          <div className="absolute inset-0 rounded-full bg-coral/20 animate-ping" />
        )}
        <Button
          size="lg"
          className={`w-24 h-24 rounded-full shadow-xl transition-all ${isRecording ? 'bg-coral hover:bg-coral' : 'bg-primary'}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? <Square className="w-8 h-8 fill-white" /> : <Mic className="w-8 h-8" />}
        </Button>
      </div>

      {audioBlob && !isRecording && (
        <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4">
          <Button variant="ghost" size="sm" onClick={() => setAudioBlob(null)} className="text-destructive">
            <Trash2 className="w-4 h-4 mr-2" /> Redo
          </Button>
          <Button size="sm" onClick={() => onUpload(audioBlob)} className="bg-green-600 hover:bg-green-700">
            <Check className="w-4 h-4 mr-2" /> Use this recording
          </Button>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;