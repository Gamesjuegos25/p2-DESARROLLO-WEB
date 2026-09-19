// src/components/EmployeeForm.tsx
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { vacancySchema, type VacancyFormData, type VacancyFormInput } from '../schemas/vacancySchema';
import type { Vacancy } from '../types';

interface VacancyFormProps {
  vacancy?: Vacancy;          // Si viene, es modo edición
  onSubmit: (data:VacancyFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;        // Error de la mutación (crear/actualizar falló), no de validación
}

// Componente reutilizable para un campo del formulario
function FormField({
  label,
  error,
  children,
  required = false,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const inputClass = (hasError: boolean) => `
  w-full px-3 py-2 border rounded-lg text-sm transition-colors
  focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
  ${hasError
    ? 'border-red-400 bg-red-50 focus:ring-red-400'
    : 'border-slate-300 bg-white'
  }
`;

function EmployeeForm({ vacancy, onSubmit, onCancel, isLoading = false, error }: VacancyFormProps) {
  const isEditing = !!vacancy;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<VacancyFormInput, unknown, VacancyFormData>({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      puesto: '',
      departamento: 'Tecnología',
      modalidad: 'presencial',
      salario_ofrecido: 0,
      fecha_publicacion: new Date().toISOString().split('T')[0],
      estado: 'abierta',
      candidatos_postulados:'',
    
      
    },
  });

  // Si viene un empleado (modo edición), poblar el formulario
  useEffect(() => {
    if (vacancy) {
      reset({
        puesto: vacancy.puesto,
        departamento: vacancy.departamento,
        modalidad: vacancy.modalidad,
        salario_ofrecido: vacancy.salario_ofrecido,
        fecha_publicacion: vacancy.fecha_publicacion,
        estado: vacancy.estado,
        candidatos_postulados:vacancy.candidatos_postulados,
    
      });
    }
  }, [vacancy, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Fila 1: Nombre y Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Nombre completo" error={errors.puesto?.message} required>
          <input
            {...register('puesto')}
            type="text"
            placeholder="Ventas"
            className={inputClass(!!errors.puesto)}
            aria-required="true"
            aria-describedby={errors.puesto ? 'name-error' : undefined}
          />
        </FormField>

         <FormField label="Departamento" error={errors.departamento?.message} required>
          <select
            {...register('departamento')}
            className={inputClass(!!errors.departamento)}
            aria-required="true"
          >
            <option value="">Selecciona...</option>
            {['Tecnología', 'Recursos Humanos', 'Finanzas', 'Operaciones', 'Ventas'].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </FormField>
      </div>

     

      {/* Fila 2: Cargo y Departamento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Modalidad" error={errors.modalidad?.message} required>
          <select
            {...register('modalidad')}
            className={inputClass(!!errors.modalidad)}
            aria-required="true"
          >
            <option value="">Selecciona...</option>
            <option value="presencial">Presencial</option>
            <option value="remoto">Remoto</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </FormField>
        </div>

       
      {/* Fila 3: Salario y Fecha de ingreso */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Salario (GTQ)" error={errors.salario_ofrecido?.message} required>
          <input
            {...register('salario_ofrecido')}
            type="number"
            min="0"
            step="100"
            placeholder="8500"
            className={inputClass(!!errors.salario_ofrecido)}
            aria-required="true"
          />
        </FormField>

        <FormField label="Fecha de publicacion" error={errors.fecha_publicacion?.message} required>
          <input
            {...register('fecha_publicacion')}
            type="date"
            className={inputClass(!!errors.fecha_publicacion)}
            aria-required="true"
          />
        </FormField>
      </div>

      {/* Fila 4: Rol y Estado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        

        <FormField label="Estado" error={errors.estado?.message}>
          <select {...register('estado')} className={inputClass(!!errors.estado)}>
            <option value="abierta">abierta</option>
            <option value="cerrada">cerrada</option>
            
          </select>
        </FormField>

        <FormField label="Rol del sistema" error={errors.candidatos_postulados?.message}>
          <select {...register('candidatos_postulados')} className={inputClass(!!errors.candidatos_postulados)}>
            <option value="employee">Empleado</option>
            <option value="hr">RRHH</option>
            <option value="admin">Administrador</option>
          </select>
        </FormField>
      </div>

      {/* Fila 5: Teléfono y Avatar (opcionales) */}
    

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-300 hover:border-slate-400 rounded-lg transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || (!isDirty && isEditing)}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-800 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50 min-w-24"
        >
          {isLoading
            ? 'Guardando...'
            : isEditing ? 'Guardar cambios' : 'Crear empleado'
          }
        </button>
      </div>
    </form>
  );
}

export default EmployeeForm;
