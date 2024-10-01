export interface Course {
  id: string;
  name: string;
  university: string;
  schedule: string;
  startDate: Date | null;
  endDate: Date | null;
  cost: number;
  paymentOptions: (string|any) [];
  syllabus:  (string|any) [];
  benefits:  (string|any) [];
  phone: string;
  inPersonSchedules:  (string|any) [];
  virtualSchedules:  (string|any) [];
}

export interface CourseCreate extends Pick<Course, 'name' | 'university' | 'schedule' | 'startDate' | 'endDate'| 'cost' | 'paymentOptions' | 'syllabus' | 'benefits' | 'phone' | 'inPersonSchedules' | 'virtualSchedules'>{
  id?: string;
}

export interface CourseTableInteface extends Pick<Course, 'id' | 'name' | 'university' | 'cost' | 'startDate' | 'endDate'> {}

export interface CourseUpdate extends Pick<Course, 'name' | 'university' | 'schedule' | 'cost' | 'paymentOptions' | 'syllabus' | 'benefits' | 'phone' | 'inPersonSchedules' | 'virtualSchedules'> {
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface PaginatedResponseCourse {
  data: Course[];
  currentPage: number;
  totalPages: number;
}
