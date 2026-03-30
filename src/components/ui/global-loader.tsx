import { Loader2 } from "lucide-react";

interface GlobalLoaderProps {
  message?: string;
}

export const GlobalLoader = ({ message = "Processing your request..." }: GlobalLoaderProps) => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className="h-20 w-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        {/* Inner Pulse */}
        <div className="absolute h-10 w-10 bg-primary/10 rounded-full animate-pulse" />
      </div>
      <div className="mt-6 flex flex-col items-center">
        <p className="text-lg font-medium text-slate-900 animate-pulse">{message}</p>
        <p className="text-sm text-slate-500 mt-1">Please do not refresh the page.</p>
      </div>
    </div>
  );
};