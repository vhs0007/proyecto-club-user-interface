import { useUserTypeStore } from '../../store/store';
import type { UserResponse, UserType, User } from '../../entities/Entities';

interface UserListProps {
  users: UserResponse[];
  onViewDetails?: (user: UserResponse) => void;
  onEdit: (user: User | null) => void;
  onDelete: (id: number) => void;
}


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

export default function UserList({
  users,
  onViewDetails = () => {},
  onEdit,
  onDelete,
}: UserListProps) {
  const getUserType = useUserTypeStore((state) => state.getUserType);
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
                    className="btn btn-sm btn-outline-info"
                    onClick={() => onViewDetails(user)}
                    title="Ver detalles"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => onEdit(user)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  {user.isActive && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(user.id)}
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
