import { useState, useRef } from "react";
import { Volume2, Loader2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuestionApiService } from "@/services/QuestionApiService";
import { toast } from "sonner";


interface AudioPlayerProps {
    questionId: string;
    onPlay?: () => void;
}



export const AudioQuestionPlayer = ({ questionId }: AudioPlayerProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleTogglePlay = async () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
            return;
        }

        try {
            setIsLoading(true);

            // FETCH WITH HEADERS MANUALLY
            const blobUrl = await QuestionApiService.getAudioBlobUrl(questionId);

            if (audioRef.current) {
                audioRef.current.src = blobUrl;
                audioRef.current.play().then(() => {
                    setIsLoading(false);
                    setIsPlaying(true);
                });

                // Cleanup to prevent memory leaks
                audioRef.current.onended = () => {
                    setIsPlaying(false);
                    URL.revokeObjectURL(blobUrl); // Free up browser memory
                };
            }
        } catch (error) {
            console.error("Auth failed or audio not found", error);
            toast.error("Something went wrong", {description: "Please login again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="inline-block">
            <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
            />
            <Button
                variant="outline"
                size="icon"
                onClick={handleTogglePlay}
                disabled={isLoading}
                className={`rounded-full h-12 w-12 border-primary/20 ${isPlaying ? 'bg-primary/10 border-primary' : ''}`}
            >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> :
                    isPlaying ? <Pause className="w-5 h-5 text-primary" /> :
                        <Volume2 className="w-5 h-5 text-primary" />}
            </Button>
        </div>
    );
};

export default AudioQuestionPlayer;