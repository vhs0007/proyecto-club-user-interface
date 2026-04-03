import { useUserStore } from '../../store/store';
import type { UserResponse } from '../../entities/Entities';
import { useNavigate } from 'react-router-dom';


function formatDate(date: Date | null | undefined): string {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '-';
  }
}

export default function UserList() {
  
  const navigate = useNavigate();
  const users: UserResponse[] = useUserStore((state) => state.users);
  const filtered = users.filter((u) => u.typeId === 1);
  return (
    <div className="user-directory">
      <div className="overflow-x-auto rounded-md border border-slate-200/80 bg-white -mx-0.5">
        <table className="min-w-full align-middle">
          <thead className="bg-slate-50">
            <tr>
              <th className="listTableTh">
                Nombre
              </th>
              <th className="listTableTh">
                Fecha registro
              </th>
              <th className="listTableTh">
                Estado
              </th>
              <th className="listTableThCenter">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/70">
                <td className="listTableTd">
                  <div className="fw-semibold text-slate-800">{user.name}</div>
                  <small className="text-slate-500">{user.email || 'Sin email'}</small>
                </td>
                <td className="listTableTd">{formatDate(user.createdAt)}</td>
                <td className="listTableTd">
                  <span className={user.isActive ? 'listBadgeStatusActive' : 'listBadgeStatusInactive'}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="listTableTd text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      className="listActionBtnEdit"
                      onClick={() => navigate(`/usuarios/editar/${user.id}/paso-1`)}
                      title="Editar"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    {user.isActive && (
                      <button
                        type="button"
                        className="listActionBtnDelete"
                        onClick={() => navigate(`/usuarios/eliminar/${user.id}`)}
                        title="Dar de baja"
                      >
                        <i className="bi bi-person-x"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <div className="mt-5 rounded-md border border-dashed border-slate-200 bg-slate-50/90 py-12 text-center text-sm text-slate-500">
          No hay trabajadores registrados
        </div>
      )}
    </div>
  );
}
