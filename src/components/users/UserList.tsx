import { useUserStore, useUserTypeStore } from '../../store/store';
import type { UserResponse, UserType } from '../../entities/Entities';
import { useNavigate } from 'react-router-dom';


function formatDate(date: Date | null | undefined): string {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '-';
  }
}


function getTypeDisplay(user: UserResponse, getUserType: (id: number) => UserType | null): string {
  const typeId = user.type?.id ?? user.typeId;
  const ut = getUserType(typeId);
  if (ut) return ut.name;
  return '';
}

export default function UserList() {
  
  const getUserType = useUserTypeStore((state) => state.getUserType);
  const navigate = useNavigate();
  const users: UserResponse[] = useUserStore((state) => state.users);

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Fecha registro</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="fw-semibold">{user.name}</div>
                <small className="text-muted">{user.email || 'Sin email'}</small>
              </td>
              <td>
                <span className={`badge bg-${user.type?.name === 'worker' ? 'primary' : user.type?.name === 'athlete' ? 'success' : 'secondary'}`}>
                  {getTypeDisplay(user, getUserType)}
                </span>
              </td>
              <td>{formatDate(user.createdAt)}</td>
              <td>
                <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <div className="d-flex gap-1 justify-content-center">
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => navigate(`/usuarios/editar/${user.id}`)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  {user.isActive && (
                    <button
                      className="btn btn-sm btn-outline-danger"
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
      {users.length === 0 && (
        <p className="text-center text-muted py-4 mb-0">No hay usuarios registrados</p>
      )}
    </div>
  );
}
