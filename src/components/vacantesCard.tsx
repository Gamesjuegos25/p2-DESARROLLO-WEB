// src/components/EmployeeCard.tsx
import type { Vacancy } from '../types';

interface VacancyCardProps {
  vacancy: Vacancy;
  onSelect?: (employee: Vacancy) => void;
  onToggleStatus?: (employee: Vacancy) => void;
}
/*
const statusConfig = {
  active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Activo' },
  inactive: { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactivo' },
  on_leave: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En permiso' },
};*/

const statusConfig = {
  abierta: { bg: 'bg-green-100', text: 'text-green-800', label: 'Abierta' },
  cerrada: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cerrada' },
};

function VacancyCard({ vacancy, onSelect, onToggleStatus }: VacancyCardProps) {
  const { puesto, departamento, modalidad, salario_ofrecido, fecha_publicacion, estado, candidatos_postulados } = vacancy;
  const statusStyle = statusConfig[estado];

  return (
    <div
      onClick={() => onSelect?.(vacancy)}
      className={`
        bg-white rounded-xl border border-slate-200 p-5 w-full
        hover:shadow-md hover:border-blue-300
        transition-all duration-200
        ${onSelect ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{puesto}</h3>
          <p className="text-sm text-slate-500 truncate">{departamento}</p>
        </div>
        <span
          onClick={(e) => { e.stopPropagation(); onToggleStatus?.(vacancy); }}
          title={onToggleStatus ? 'Clic para cambiar el estado' : undefined}
          className={`text-[10px] px-2 py-1 rounded-full font-medium ${statusStyle.bg} ${statusStyle.text} ${onToggleStatus ? 'cursor-pointer hover:opacity-75' : ''}`}
        >
          {statusStyle.label}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Modalidad</span>
          <span className="font-medium text-slate-800 capitalize">{modalidad}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Salario</span>
          <span className="font-medium text-slate-800">Q {salario_ofrecido.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Postulados</span>
          <span className="font-medium text-slate-800">{candidatos_postulados}</span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-slate-500">Publicación</span>
          <span className="font-medium text-slate-800">{fecha_publicacion}</span>
        </div>
      </div>
    </div>
  );
}

export default VacancyCard;
