interface Activity {
  id: number;
  name: string;
  type: string;
  startAt: string;
  endAt: string;
  userId: number;
  cost?: number | null;
  isActive?: boolean;
}

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
}

const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-ES');
};

const formatTime = (date: string): string => {
  return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
};

export default function ActivityList({ activities, onEdit, onDelete }: ActivityListProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Usuario</th>
            <th>Costo</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td>
                <span className="fw-semibold">{activity.name}</span>
              </td>
              <td>
                <span className="badge bg-info">{activity.type}</span>
              </td>
              <td>
                <div>{formatDate(activity.startAt)}</div>
                <small className="text-muted">{formatTime(activity.startAt)}</small>
              </td>
              <td>
                <div>{formatDate(activity.endAt)}</div>
                <small className="text-muted">{formatTime(activity.endAt)}</small>
              </td>
              <td>{activity.userId}</td>
              <td>
                {typeof activity.cost === 'number'
                  ? `$${activity.cost.toLocaleString()}`
                  : '-'}
              </td>
              <td>
                <span className={`badge ${activity.isActive ? 'bg-success' : 'bg-danger'}`}>
                  {activity.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </td>
              <td>
                <div className="d-flex gap-1 justify-content-center">
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => onEdit(activity)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(activity.id)}
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
      {activities.length === 0 && (
        <p className="text-center text-muted py-4 mb-0">No hay actividades registradas</p>
      )}
    </div>
  );
}

