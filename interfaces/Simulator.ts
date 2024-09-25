export interface Simulator {
  id: string;
  name: string;
  password: string;
  duration: number;
  visibility: boolean;
  navigate: boolean;
  number_of_questions?: number;
}

export interface CreateSimulator extends Pick<Simulator, 'name' | 'password' | 'duration' | 'visibility' | 'navigate'>{
  id?: string;
  number_of_questions?: number;
}
