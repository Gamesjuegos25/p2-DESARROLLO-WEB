// src/services/vacancyService.ts
import { apiClient } from './api';
import type { CreateVacancyDto, UpdateVacancyDto, PaginatedResponse, Vacancy } from '../types';

export interface vacancyFilters {
  search?: string;
  department?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

export const VacancyService = {
  // Obtener lista paginada
  getAll: async (filters: vacancyFilters = {}): Promise<PaginatedResponse<Vacancy>> => {
    const params = new URLSearchParams();
    if (filters.search) params.set('q', filters.search);
    if (filters.department) params.set('department', filters.department);
    if (filters.status) params.set('status', filters.status);
    if (filters.page) params.set('_page', String(filters.page));
    if (filters.pageSize) params.set('_limit', String(filters.pageSize));

    const queryString = params.toString();
    const response = await apiClient.get<Vacancy[]>(queryString ? `/vacancy?${queryString}` : '/vacancy');
    const total = parseInt(response.headers['x-total-count'] || '0', 10);

    return {
      data: response.data,
      total,
      page: filters.page || 1,
      pageSize: filters.pageSize || 10,
      totalPages: Math.ceil(total / (filters.pageSize || 10)),
    };
  },

  // Obtener una vacante por ID
  getById: async (id: number): Promise<Vacancy> => {
    const response = await apiClient.get<Vacancy>(`/vacancy/${id}`);
    return response.data;
  },

  // Crear nueva vacante
  create: async (data: CreateVacancyDto): Promise<Vacancy> => {
    const response = await apiClient.post<Vacancy>('/vacancy', data);
    return response.data;
  },

  // Actualizar vacante
  update: async (id: number, data: UpdateVacancyDto): Promise<Vacancy> => {
    const response = await apiClient.patch<Vacancy>(`/vacancy/${id}`, data);
    return response.data;
  },

  // Eliminar vacante
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vacancy/${id}`);
  },
};
