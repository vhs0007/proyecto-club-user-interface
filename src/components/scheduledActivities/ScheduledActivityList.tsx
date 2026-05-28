import { useNavigate } from 'react-router-dom';
import type {
  DatetimeScheduledActivityNavigation,
  ScheduledActivityResponse,
} from '../../entities/Entities';

function formatSchedules(datetimes: DatetimeScheduledActivityNavigation[]): string {
  if (!datetimes?.length) return '-';
  return datetimes
    .map((d) => `${d.workingDay.dayOfWeek} ${d.hourStart} - ${d.hourEnd}`)
    .join(', ');
}

function formatMembershipTypes(
  membershipTypes: ScheduledActivityResponse['membershipTypes'],
): string {
  if (!membershipTypes?.length) return '-';
  return membershipTypes.map((m) => m.name).join(', ');
}

export default function ScheduledActivityList({
  scheduledActivities,
}: {
  scheduledActivities: ScheduledActivityResponse[];
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="overflow-x-auto rounded-md border border-slate-200/80 bg-white -mx-0.5">
        <table className="min-w-full align-middle">
          <thead className="bg-slate-50">
            <tr>
              <th className="listTableTh">Instalación</th>
              <th className="listTableTh">Responsable</th>
              <th className="listTableTh">Membresías</th>
              <th className="listTableTh">Horarios</th>
              <th className="listTableTh">Asistentes</th>
              <th className="listTableThCenter">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {scheduledActivities.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/70">
                <td className="listTableTd">
                  <span className="font-semibold text-slate-800">{item.facility?.type ?? '-'}</span>
                </td>
                <td className="listTableTd">{item.user?.name ?? '-'}</td>
                <td className="listTableTd">{formatMembershipTypes(item.membershipTypes)}</td>
                <td className="listTableTd">{formatSchedules(item.datetimeScheduledActivities)}</td>
                <td className="listTableTd">
                  {item.assistantWorkers?.length
                    ? item.assistantWorkers.map((w) => w.name).join(', ')
                    : '-'}
                </td>
                <td className="listTableTd text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      className="listActionBtnEdit"
                      onClick={() => navigate(`/actividades-rutinarias/editar/${item.id}`)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      type="button"
                      className="listActionBtnDelete"
                      onClick={() => navigate(`/actividades-rutinarias/eliminar/${item.id}`)}
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
      {scheduledActivities.length === 0 && (
        <div className="mt-5 rounded-md border border-dashed border-slate-200 bg-slate-50/90 py-12 text-center text-sm text-slate-500">
          No hay actividades rutinarias registradas
        </div>
      )}
    </>
  );
}
