import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissionService } from '@/services/admissionService';

export const useAdmissionApplications = (params: any) => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admissionApplications', params],
    queryFn: () => admissionService.getApplications(params),
  });

  return {
    ...query,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['admissionApplications', params] }),
  };
};

export const useAdmissionStats = () => {
  return useQuery({
    queryKey: ['admissionStats'],
    queryFn: () => admissionService.getStats(),
  });
};

export const useUpdateAdmissionStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      admissionService.updateApplicationStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissionApplications'] });
      queryClient.invalidateQueries({ queryKey: ['admissionStats'] });
    },
  });
};

export const useDeleteAdmission = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => admissionService.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admissionApplications'] });
      queryClient.invalidateQueries({ queryKey: ['admissionStats'] });
      options?.onSuccess?.();
    },
  });
};

export const useExportAdmissions = () => {
  return useMutation({
    mutationFn: () => admissionService.exportApplications(),
    onSuccess: (data) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `admissions_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
  });
};
