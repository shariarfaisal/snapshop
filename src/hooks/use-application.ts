import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { admissionService } from '@/services/admission';
import { useToast } from './use-toast';
import { Application, ApplicationCreate, ApplicationUpdate } from '@/types/application';

export function useApplications(params?: {
  page?: number;
  limit?: number;
  term?: string;
  level?: string;
  status?: string;
  merit_cat_id?: string;
}) {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => admissionService.getAllApplications(params),
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => admissionService.getApplicationById(id),
    enabled: !!id,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ApplicationCreate) => admissionService.createApplication(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast({
        title: 'Success',
        description: 'Application created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApplicationUpdate }) =>
      admissionService.updateApplication(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      toast({
        title: 'Success',
        description: 'Application updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, file, type }: { id: string; file: File; type: string }) =>
      admissionService.uploadApplicationDocument(id, file, type),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
} 