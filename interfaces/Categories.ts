export interface Categories {
  id: number;
  name: string;
}

export interface CategoryNewUpdate extends Pick<Categories, 'name'> {
  id?: number
}

export interface CategoryTable {
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
