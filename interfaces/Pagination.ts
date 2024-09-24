export interface Pagination {
  currentPage: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  previousPage: number | null
  nextPage: number | null
  total: number
  pageSize: number
}


