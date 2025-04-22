import { campusService } from "@/services/campus";
import { UpdateCampusInput } from "@/types/campus";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export const useCampus = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: [campusService.getAll.name],
    queryFn: () => campusService.getAll(),
  });

  const createCampus = useMutation({
    mutationKey: [campusService.create.name],
    mutationFn: campusService.create
  })

  const updateCampus = useMutation({
    mutationKey: [campusService.update.name],
    mutationFn: ({id, data}: {id: string, data: UpdateCampusInput}) => {
        return campusService.update(id, data)
    }
  })

  const deleteCampus = useMutation({    
    mutationKey: [campusService.delete.name],
    mutationFn: campusService.delete
  })

  const getCampusById = useMutation({
    mutationKey: [campusService.getById.name],
    mutationFn: (id: string) => campusService.getById(id),
  })

  return {
    campuses: data,
    isLoading,
    error,
    createCampus,
    updateCampus,
    deleteCampus,
    getCampusById,
    invalidateCampuses: () => {
        queryClient.invalidateQueries({
            queryKey: [campusService.getAll.name]
        })
    },
    invalidateCampusById: (id: string) => {
        queryClient.invalidateQueries({
            queryKey: [campusService.getById.name, id]
        })
    }
  };
};
