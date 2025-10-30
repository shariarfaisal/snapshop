import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Department, DepartmentFilters, DepartmentFormData } from '@/types/department';

export const useDepartments = (filters?: DepartmentFilters) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.per_page) params.append('per_page', filters.per_page.toString());

      const response = await apiClient.get(`/departments?${params.toString()}`);
      
      const data = response.data;
      if (data.success) {
        if (Array.isArray(data.data)) {
          setDepartments(data.data);
        } else if (data.data.data) {
          setDepartments(data.data.data);
          setMeta(data.data);
        } else {
          setDepartments(data.data);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch departments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [filters?.search, filters?.status, filters?.page, filters?.per_page]);

  const createDepartment = async (data: DepartmentFormData) => {
    const response = await apiClient.post('/departments', data);
    await fetchDepartments();
    return response.data.data;
  };

  const updateDepartment = async (id: number, data: Partial<DepartmentFormData>) => {
    const response = await apiClient.put(`/departments/${id}`, data);
    await fetchDepartments();
    return response.data.data;
  };

  const deleteDepartment = async (id: number) => {
    await apiClient.delete(`/departments/${id}`);
    await fetchDepartments();
    return true;
  };

  return {
    departments,
    isLoading,
    error,
    meta,
    refetch: fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  };
};
