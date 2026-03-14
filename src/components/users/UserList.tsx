interface User {
  id: number;
  name: string;
  type: 'worker' | 'athlete' | 'member';
  email: string | null;
  createdAt: string;
  updatedAt: string | null;
  isActive: boolean;
  role?: string;
  roleId?: number;
  gender?: 'male' | 'female';
}

interface UserListProps {
  users: User[];
  onViewDetails?: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const roleIdToLabel: Record<number, string> = {
  1: 'Estándar',
  2: 'VIP',
  3: 'Atleta',
  4: 'Administrador',
  5: 'Entrenador',
  6: 'Nutricionista',
  7: 'Psicólogo',
  8: 'Fisioterapeuta',
  9: 'Administrativo',
  10: 'Limpieza',
};

function getRoleDisplay(user: User): string {
  if (user.role) return roleLabels[user.role] || user.role;
  if (user.roleId != null) return roleIdToLabel[user.roleId] ?? `Rol ${user.roleId}`;
  return '-';
}

function formatDate(date: string | null | undefined): string {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '-';
  }
}

const typeLabels: Record<string, string> = {
  worker: 'Trabajador',
  athlete: 'Atleta',
  member: 'Miembro',
};

const roleLabels: Record<string, string> = {
  standard: 'Estándar',
  vip: 'VIP',
  athlete: 'Atleta',
  admin: 'Administrador',
  coach: 'Entrenador',
  nutritionist: 'Nutricionista',
  psychologist: 'Psicólogo',
  physical_therapist: 'Fisioterapeuta',
  administrative: 'Administrativo',
  cleaner: 'Limpieza',
};

export default function UserList({
  users,
  onViewDetails = () => {},
  onEdit,
  onDelete,
}: UserListProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Rol</th>
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
                <span className={`badge bg-${user.type === 'worker' ? 'primary' : user.type === 'athlete' ? 'success' : 'secondary'}`}>
                  {typeLabels[user.type]}
                </span>
              </td>
              <td>{getRoleDisplay(user)}</td>
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
