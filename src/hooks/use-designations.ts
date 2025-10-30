import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Designation, DesignationFilters, DesignationFormData } from '@/types/designation';

export const useDesignations = (filters?: DesignationFilters) => {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);

  const fetchDesignations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.department_id) params.append('department_id', filters.department_id.toString());
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.per_page) params.append('per_page', filters.per_page.toString());

      const response = await apiClient.get(`/api/designations?${params.toString()}`);
      
      const data = response.data;
      if (data.success) {
        if (Array.isArray(data.data)) {
          setDesignations(data.data);
        } else if (data.data.data) {
          setDesignations(data.data.data);
          setMeta(data.data);
        } else {
          setDesignations(data.data);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch designations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, [filters?.search, filters?.status, filters?.department_id, filters?.page, filters?.per_page]);

  const createDesignation = async (data: DesignationFormData) => {
    const response = await apiClient.post('/api/designations', data);
    await fetchDesignations();
    return response.data.data;
  };

  const updateDesignation = async (id: number, data: Partial<DesignationFormData>) => {
    const response = await apiClient.put(`/api/designations/${id}`, data);
    await fetchDesignations();
    return response.data.data;
  };

  const deleteDesignation = async (id: number) => {
    await apiClient.delete(`/api/designations/${id}`);
    await fetchDesignations();
    return true;
  };

  return {
    designations,
    isLoading,
    error,
    meta,
    refetch: fetchDesignations,
    createDesignation,
    updateDesignation,
    deleteDesignation,
  };
};
