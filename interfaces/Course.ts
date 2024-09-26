export interface Course {
  id?: string;
  name: string;
  university: string;
  schedule: string;
  startDate: Date;
  endDate: Date;
  cost: number;
  paymentOptions: { method: string }[];
  syllabus: { topic: string }[];
  benefits: { description: string }[];
  phone: string;
  schedules: { timetable: string }[];
}
