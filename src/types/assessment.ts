
export enum AssessmentType {
  OPTION_BASED = "option_based",
  AUDIO_BASED = "audio_based",
}



export interface AssessmentDTO {
  id?: string;
  name: string;
  description: string;
  category_type: AssessmentType;
  class_ranges?: any[];
  questions?: any[]; // Expand as needed
  options?: any[];    // Expand as needed
}