import { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';

interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  previousPage: number | null;
  nextPage: number | null;
  total: number;
}

interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  previousPage: number | null;
  nextPage: number | null;
  total: number;
}

interface UsePaginationOptions {
  baseUrl: string;
  initialPageSize?: number;
  queryKey: string;
}

export function usePagination<T>({baseUrl, initialPageSize = 10, queryKey}: UsePaginationOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Obtener valores actuales de los parámetros de URL
  const currentPage = Number(searchParams.get('page')) || 1;
  const pageSize = Number(searchParams.get('count')) || initialPageSize;

  // Función para fetchear datos
  const fetchData = async (): Promise<PaginatedResponse<T>> => {
    const response = await axiosInstance.get<PaginatedResponse<T>>(
      `${baseUrl}?page=${currentPage}&count=${pageSize}`
    );
    return response.data;
  };

  // Usar React Query para manejar el estado y el caché
  const {
    data: paginatedData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: [queryKey, currentPage, pageSize],
    queryFn: fetchData,
    placeholderData: (previousData) => previousData, // Reemplaza keepPreviousData
    staleTime: 5000, // Opcional: tiempo en ms antes de considerar los datos obsoletos
  });

  // Función para crear query strings
  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      Object.entries(params).forEach(([name, value]) => {
        newSearchParams.set(name, value);
      });
      return newSearchParams.toString();
    },
    [searchParams]
  );

  // Handlers para la paginación
  const handleCreateNew = useCallback(() => {
    router.push(`/admin/${baseUrl}/create`);
  }, [router, baseUrl]);

  const handlePageChange = useCallback((newPage: number) => {
    if (paginatedData && newPage >= 1 && newPage <= paginatedData.totalPages) {
      const queryString = createQueryString({
        page: newPage.toString(),
        count: pageSize.toString()
      });
      router.push(`/admin/${baseUrl}?${queryString}`);
    }
  }, [paginatedData, pageSize, router, baseUrl, createQueryString]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    const queryString = createQueryString({
      page: '1',
      count: newPageSize.toString()
    });
    router.push(`/admin/${baseUrl}?${queryString}`);
  }, [router, baseUrl, createQueryString]);

  // Construir objeto de paginación
  const pagination: PaginationState = {
    currentPage,
    pageSize,
    totalPages: paginatedData?.totalPages || 1,
    hasPreviousPage: paginatedData?.hasPreviousPage || false,
    hasNextPage: paginatedData?.hasNextPage || false,
    previousPage: paginatedData?.previousPage || null,
    nextPage: paginatedData?.nextPage || null,
    total: paginatedData?.total || 0
  };

  return {
    data: paginatedData?.data || [],
    pagination,
    isLoading,
    isError,
    error,
    refetch,
    handleCreateNew,
    handlePageChange,
    handlePageSizeChange
  };
}
