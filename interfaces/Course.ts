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
  schedules:  (string|any) [];
}

export interface CourseCreate extends Pick<Course, 'name' | 'university' | 'schedule' | 'startDate' | 'endDate'| 'cost' | 'paymentOptions' | 'syllabus' | 'benefits' | 'phone' | 'schedules'>{
  id?: string;
}

export interface CourseTableInteface extends Pick<Course, 'id' | 'name' | 'university' | 'cost' | 'startDate' | 'endDate'> {}

export interface CourseUpdate extends Pick<Course, 'name' | 'university' | 'schedule' | 'cost' | 'paymentOptions' | 'syllabus' | 'benefits' | 'phone' | 'schedules'> {
  startDate?: Date | null;
  endDate?: Date | null;
}
