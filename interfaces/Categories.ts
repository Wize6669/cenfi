export interface Categories {
  id: number;
  name: string;
  questionCount?: number;
}

export interface CategoryNewUpdate extends Pick<Categories, 'name'> {
  id?: number
}

export interface CategoryTableInterface {
  id: number;
  name: string;
  questionCount: number;
}

export interface PaginatedResponse {
  data: Categories[];
  currentPage: number;
  totalPages: number;
  total: number;
}
