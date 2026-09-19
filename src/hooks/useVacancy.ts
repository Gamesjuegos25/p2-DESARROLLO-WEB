// src/hooks/useVacancy.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { VacancyService, type vacancyFilters } from '../services/vacancyService';
import type { CreateVacancyDto, UpdateVacancyDto } from '../types';

// Query key factory — centraliza los nombres de las queries
export const vacancyKeys = {
  all: ['vacancy'] as const,
  list: (filters: vacancyFilters) => ['vacancy', 'list', filters] as const,
  detail: (id: number) => ['vacancy', id] as const,
};

export function useVacancy(filters: vacancyFilters = {}) {
  return useQuery({
    queryKey: vacancyKeys.list(filters),
    queryFn: () => VacancyService.getAll(filters),
  });
}

export function useVacancyById(id: number | null) {
  return useQuery({
    queryKey: vacancyKeys.detail(id!),
    queryFn: () => VacancyService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVacancyDto) => VacancyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacancyKeys.all });
    },
  });
}

export function useUpdateVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVacancyDto }) =>
      VacancyService.update(id, data),
    onSuccess: (updatedVacancy) => {
      queryClient.setQueryData(vacancyKeys.detail(updatedVacancy.id), updatedVacancy);
      queryClient.invalidateQueries({ queryKey: vacancyKeys.all });
    },
  });
}

export function useDeleteVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => VacancyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vacancyKeys.all });
    },
  });
}

export const useCreateEmployee = useCreateVacancy;
export const useUpdateEmployee = useUpdateVacancy;
export const useDeleteEmployee = useDeleteVacancy;
