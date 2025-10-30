import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
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

      const response = await api.get(`/departments?${params.toString()}`);
      
      if (response.data.success) {
        const data = response.data.data;
        if (Array.isArray(data)) {
          setDepartments(data);
        } else if (data.data) {
          setDepartments(data.data);
          setMeta(data);
        } else {
          setDepartments(data);
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
    const response = await api.post('/departments', data);
    if (response.data.success) {
      await fetchDepartments();
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to create department');
  };

  const updateDepartment = async (id: number, data: Partial<DepartmentFormData>) => {
    const response = await api.put(`/departments/${id}`, data);
    if (response.data.success) {
      await fetchDepartments();
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to update department');
  };

  const deleteDepartment = async (id: number) => {
    const response = await api.delete(`/departments/${id}`);
    if (response.data.success) {
      await fetchDepartments();
      return true;
    }
    throw new Error(response.data.message || 'Failed to delete department');
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
