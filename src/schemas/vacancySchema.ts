// src/schemas/employeeSchema.ts
import { z } from 'zod';

export const vacancySchema = z.object({
  puesto: z
    .string({ error: 'El puesto es requerido' })
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),

  modalidad: z.enum(['presencial', 'remoto', 'hibrido'], {
    error: 'Selecciona una modalidad',
  }),

  salario_ofrecido: z.coerce
    .number({ error: 'El salario es requerido' })
    .min(1, 'El salario debe ser mayor a 0')
    .max(999999, 'Salario fuera de rango'),

  departamento: z.enum(
    ['Tecnología', 'Recursos Humanos', 'Finanzas', 'Operaciones', 'Ventas'],
    { error: 'Selecciona un departamento' }
  ),

  fecha_publicacion: z
    .string({ error: 'La fecha de ingreso es requerida' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)'),

  estado: z.enum(['abierta', 'cerrada']).default('abierta'),

  candidatos_postulados: z
    .string({ error: 'El candidato es requerido' })
    .min(2, 'Mínimo 5 caracteres')
    .max(100, 'Máximo 100 caracteres'),
});

export type VacancyFormData = z.infer<typeof vacancySchema>;

// Tipo de ENTRADA del schema (antes de que Zod corra z.coerce y los .default()) —
// react-hook-form necesita este tipo para el formulario en sí, distinto del tipo
// de SALIDA (EmployeeFormData) que recibe onSubmit una vez que el resolver ya validó.
export type VacancyFormInput = z.input<typeof vacancySchema>;
