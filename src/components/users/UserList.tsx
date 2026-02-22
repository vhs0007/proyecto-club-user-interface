interface User {
  id: number;
  name: string;
  type: 'worker' | 'athlete' | 'member';
  email: string | null;
  createdAt: string;
  updatedAt: string | null;
  isActive: boolean;
  role?: string;
  gender?: 'male' | 'female';
}

interface UserListProps {
  users: User[];
  loading: boolean;
  onViewDetails: (user: User) => void;
  onEdit: (user: User) => void;
  onDeactivate: (id: number) => void;
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

const genderLabels: Record<string, string> = {
  male: 'Masculino',
  female: 'Femenino',
};

export default function UserList({
  users,
  loading,
  onViewDetails,
  onEdit,
  onDeactivate,
}: UserListProps) {
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Rol</th>
            <th>Género</th>
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
              <td>{user.role ? roleLabels[user.role] || user.role : '-'}</td>
              <td>{user.gender ? genderLabels[user.gender] : '-'}</td>
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
                      onClick={() => onDeactivate(user.id)}
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
