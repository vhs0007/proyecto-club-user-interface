import { useNavigate } from 'react-router-dom';
import type { ActivityResponse } from '../../entities/Entities';

function formatActivityDate(date: Date | string | null | undefined): string {
  if (date == null) return '-';
  try {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '-';
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '-';
  }
}

export default function ActivityList({ activities }: { activities: ActivityResponse[] }) {
  const navigate = useNavigate();
  console.log(activities);

  return (
    <>
      <div className="overflow-x-auto rounded-md border border-slate-200/80 bg-white -mx-0.5">
        <table className="min-w-full align-middle">
          <thead className="bg-slate-50">
            <tr>
              <th className="listTableTh">Nombre</th>
              <th className="listTableTh">Tipo</th>
              <th className="listTableTh">Fecha</th>
              <th className="listTableTh">Hora Inicio</th>
              <th className="listTableTh">Hora Fin</th>
              <th className="listTableTh">Instalación</th>
              <th className="listTableTh">Usuario</th>
              <th className="listTableTh">Costo</th>
              <th className="listTableTh">Estado</th>
              <th className="listTableThCenter">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activities.map((activity: ActivityResponse) => (
              <tr key={activity.id} className="hover:bg-slate-50/70">
                <td className="listTableTd">
                  <span className="font-semibold text-slate-800">{activity.name}</span>
                </td>
                <td className="listTableTd">
                  <span className="listBadgeTypeInfo">{activity.type}</span>
                </td>
                <td className="listTableTd">{formatActivityDate(activity.date)}</td>
                <td className="listTableTd">{activity.hourStart || '-'}</td>
                <td className="listTableTd">{activity.hourEnd || '-'}</td>
                <td className="listTableTd">
                  <span className="text-slate-800">{activity.facility?.type ?? '-'}</span>
                </td>
                <td className="listTableTd">{activity.user?.name ?? '-'}</td>
                <td className="listTableTd">
                  {typeof activity.cost === 'number'
                    ? `$${activity.cost.toLocaleString()}`
                    : '-'}
                </td>
                <td className="listTableTd">
                  <span className={activity.facility?.isActive ? 'listBadgeStatusActive' : 'listBadgeStatusInactive'}>
                    {activity.facility?.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="listTableTd text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      className="listActionBtnEdit"
                      onClick={() => navigate(`/actividades/editar/${activity.id}`)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    <button
                      type="button"
                      className="listActionBtnDelete"
                      onClick={() => navigate(`/actividades/eliminar/${activity.id}`)}
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
      </div>
      {activities.length === 0 && (
        <div className="mt-5 rounded-md border border-dashed border-slate-200 bg-slate-50/90 py-12 text-center text-sm text-slate-500">
          No hay actividades registradas
        </div>
      )}
    </>
  );
}
