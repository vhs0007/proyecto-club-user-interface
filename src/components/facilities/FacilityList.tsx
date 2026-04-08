import type { FacilityResponse } from '../../entities/Entities';

interface FacilityListProps {
  facilities: FacilityResponse[];
  onEdit: (facility: FacilityResponse) => void;
  onDelete: (id: number) => void;
}

export default function FacilityList({ facilities, onEdit, onDelete }: FacilityListProps) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full align-middle">
        <thead className="bg-slate-50">
          <tr>
            <th className="listTableTh">ID</th>
            <th className="listTableTh">Tipo</th>
            <th className="listTableTh">Capacidad</th>
            <th className="listTableTh">Responsable</th>
            <th className="listTableTh">Asistente</th>
            <th className="listTableTh">Membresías</th>
            <th className="listTableTh">Estado</th>
            <th className="listTableThCenter">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {facilities.map((facility) => (
            <tr key={facility.id} className="hover:bg-slate-50/70">
              <td className="listTableTd">{facility.id}</td>
              <td className="listTableTd">
                <span className="listBadgeTypeInfo">{facility.type}</span>
              </td>
              <td className="listTableTd">{facility.capacity}</td>
              <td className="listTableTd">{facility.responsibleWorker?.name ?? facility.responsibleWorker?.id ?? '-'}</td>
              <td className="listTableTd">{facility.assistantWorker?.name ?? facility.assistantWorker?.id ?? '-'}</td>
              <td className="listTableTd">{facility.membershipTypes.map((membershipType) => membershipType.name).join(', ') ?? '-'}</td>
              <td className="listTableTd">
                <span className={facility.isActive ? 'listBadgeStatusActive' : 'listBadgeStatusInactive'}>
                  {facility.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </td>
              <td className="listTableTd">
                <div className="flex justify-center gap-2">
                  <button
                    className="listActionBtnEdit"
                    onClick={() => onEdit(facility)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="listActionBtnDelete"
                    onClick={() => onDelete(facility.id)}
                    title="Eliminar"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {facilities.length === 0 && (
        <p className="py-8 text-center text-sm text-slate-500">No hay instalaciones registradas</p>
      )}
    </div>
  );
}
