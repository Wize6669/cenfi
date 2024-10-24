export interface CategoryQuestions {
  categoryId: number;
  numberOfQuestions: number;
}

export interface Simulator {
  id?: string;
  name: string;
  password: string;
  duration: number;
  visibility: boolean;
  navigate: boolean;
  review: boolean;
  categoryQuestions?: CategoryQuestions[];
  number_of_questions?: number;
}

export interface SimulatorListTable extends Omit<Simulator, 'categoryQuestions'>{
  id: string;
}

export interface SimulatorUpdate extends Omit<Simulator, 'password'> {}

export interface SimulatorCreate {
  id: string;
  name: string;
  duration: number;
  visibility: boolean;
  navigate: boolean;
  review: boolean;
  number_of_questions: number;
  categoryQuestions: CategoryQuestions[];
}



