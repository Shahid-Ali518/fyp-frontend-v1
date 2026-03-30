export interface AssessmentClassRangeDTO {
  id?: string;
  category_id?: string;
  label: string;
  min_score: number;
  max_score: number;
  recommendation?: string;
}