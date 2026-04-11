// for admin summary users
export interface UserSummaryDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;

}

// for user history
export interface UserHistoryDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
    
//   test_attempts: TestAttemptDTO[];

}