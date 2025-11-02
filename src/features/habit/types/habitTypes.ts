export type TimeSection =
  | "MORNING"
  | "AFTERNOON"
  | "NIGHT"
  | "OTHER"
    | "ALL_DAY";
  
    export type HabitIcon =
      | "READ"
      | "WORKOUT"
      | "GETUP_EARLY"
      | "OTHER"
      | "STUDY"
      | "WORK";

export interface Habit {
  id: number;
  userId?: number;
  title: string;
  quote: string;
  startDate: string;
  timeSection: TimeSection;
  goalDays: number;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
  icon?: HabitIcon;
}

export interface HabitCreateRequest {
  title: string;
  quote: string;
  startDate: string;
  timeSection: TimeSection;
  goalDays: number;
  completed: boolean;
  icon?: HabitIcon;
}

export interface HabitUpdateRequest {
  title: string;
  quote: string;
  startDate: string;
  timeSection: TimeSection;
  goalDays: number;
  completed: boolean;
  icon?: HabitIcon;
}

export interface HabitResponse {
  success: boolean;
  message: string;
  data: Habit;
}

export interface HabitListResponse {
  success: boolean;
  message: string;
  data: {
    content: Habit[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
      };
      offset: number;
      unpaged: boolean;
      paged: boolean;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    numberOfElements: number;
    size: number;
    number: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    empty: boolean;
  };
}

export interface HabitDeleteResponse {
  success: boolean;
  message: string;
}

export interface HabitsByDateResponse {
  success: boolean;
  message: string;
  data: Habit[];
}
