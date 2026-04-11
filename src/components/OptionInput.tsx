import { CheckCircle2 } from "lucide-react";
import { OptionProps } from "@/types/survey_option";

export const OptionInput = ({ options, selectedId, onSelect }: OptionProps) => {
  return (
    /* Change: grid-cols-1 for mobile, md:grid-cols-2 for desktop.
       Added 'max-w-4xl mx-auto' to prevent the buttons from being TOO wide on ultra-wide screens.
    */
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onSelect(option.id)}
          className={`w-full p-4 rounded-xl text-left border-2 transition-all flex justify-between items-center group ${
            selectedId === option.id
              ? "border-primary bg-primary/5 text-primary shadow-sm"
              : "border-slate-100 hover:border-slate-200 text-slate-600 bg-white"
          }`}
        >
          <span className={`font-medium text-sm md:text-base ${selectedId === option.id ? 'text-primary' : 'text-slate-700'}`}>
            {option.option_text}
          </span>
          
          <div className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
            selectedId === option.id ? 'bg-primary border-primary' : 'border-slate-200 group-hover:border-slate-300'
          }`}>
            {selectedId === option.id && <CheckCircle2 className="w-3 h-3 text-white" />}
          </div>
        </button>
      ))}
    </div>
  );
};

export default OptionInput;