export interface SurveyOptionDTO {
  id?: string;
  category_id?: string;
  option_text: string;
  weightage: number;
}

export interface OptionProps {
  options: any[];
  selectedId: string;
  onSelect: (id: string) => void;
}