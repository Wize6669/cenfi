import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { axiosInstance } from "@/lib/axios";
import { PaginationState, PaginatedResponse } from '@/interfaces/Pagination';

interface UsePaginationProps {
  baseUrl: string;
  initialPageSize?: number;
}

export const usePagination = <T,>({baseUrl, initialPageSize = 10}: UsePaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: Number(searchParams.get('page')) || 1,
    pageSize: Number(searchParams.get('count')) || initialPageSize,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
    previousPage: null,
    nextPage: null,
    total: 0
  });

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<PaginatedResponse<T>>(
        `${baseUrl}?page=${pagination.currentPage}&count=${pagination.pageSize}`
      );

      const {
        data: responseData,
        currentPage,
        totalPages,
        hasPreviousPage,
        hasNextPage,
        previousPage,
        nextPage,
        total
      } = response.data;

      setData(responseData);
      setPagination(prev => ({
        ...prev,
        currentPage,
        totalPages,
        hasPreviousPage,
        hasNextPage,
        previousPage,
        nextPage,
        total,
      }));

      return responseData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar los datos';
      setError(errorMessage);
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, pagination.currentPage, pagination.pageSize]);

  const handleCreateNew = useCallback(() => {
    router.push(`/admin/${baseUrl}/create`);
  }, [router, baseUrl]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({...prev, currentPage: newPage}));
      const queryString = createQueryString('page', newPage.toString());
      router.push(`/admin/${baseUrl}?${queryString}`);
    }
  }, [pagination.totalPages, router, baseUrl, createQueryString]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPagination(prev => ({...prev, pageSize: newPageSize, currentPage: 1}));
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('count', newPageSize.toString());
    router.push(`/admin/${baseUrl}?${params.toString()}`);
  }, [router, baseUrl]);

  // Cargar datos cuando cambie la paginación
  useEffect(() => {
    fetchData().then(() => {
      console.log('Datos cargadas correctamente.');
    })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [pagination.currentPage, pagination.pageSize, fetchData]);

  return {
    data,
    pagination,
    isLoading,
    error,
    fetchData,
    handleCreateNew,
    handlePageChange,
    handlePageSizeChange
  };
};
