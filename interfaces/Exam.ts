export interface SimulatorExamProps {
  simulatorId: string;
}

export interface Category {
  id: number
  name: string
}

export interface Option {
  id: number
  content: {
    type: string
    content: any[]
  }
  isCorrect: boolean
}

export interface Question {
  id: number
  content: {
    type: string
    content: any[]
  }
  justification?: {
    type: string
    content: any[]
  }
  options: Option[]
  category: Category
  simulatorId?: string
}

export interface Simulator {
  id: string;
  name: string;
  duration: number;
  navigate: boolean;
  visibility: boolean;
  review: boolean;
  number_of_questions: number;
  questions?: Question[];
}

export interface ExamData {
  simulatorId: string
  simulatorName: string
  questions: any[]
  review: boolean
  userAnswers: { [key: number]: number | null }
  timeSpent: number
  fullName: string
  email: string
  score: number
  totalQuestions: number
  totalAnswered: number
  percentageAnswered: number
  correctAnswers: number
  incorrectAnswers: number
  unansweredQuestions: number
}

export interface ExamDataReview {
  simulatorId: string
  simulatorName: string
  questions: Question[]
  userAnswers: { [key: number]: number | null }
  timeSpent: number
  fullName: string
  email: string
  score: number
  totalQuestions: number
  totalAnswered: number
  percentageAnswered: number
  correctAnswers: number
  incorrectAnswers: number
  unansweredQuestions: number
}

