export interface Term {
  id: number;
  title: number;
  startDate: string;
  endDate: string;
}

export interface TermFilters {
  studentIds?: number[];
  startDateUntil?: string;
}
