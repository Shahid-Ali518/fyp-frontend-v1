import { AssessmentDTO } from "./assessment";

export interface TestAttempt {
    id: string,
    attempt_date: string,
    test_store: Number,
    test_state: string,
    category: AssessmentDTO
}