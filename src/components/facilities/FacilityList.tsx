import type { FacilityResponse } from '../../entities/Entities';

interface FacilityListProps {
  facilities: FacilityResponse[];
  onEdit: (facility: FacilityResponse) => void;
  onDelete: (id: number) => void;
}

export default function FacilityList({ facilities, onEdit, onDelete }: FacilityListProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Capacidad</th>
            <th>Responsable</th>
            <th>Asistente</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((facility) => (
            <tr key={facility.id}>
              <td>{facility.id}</td>
              <td>
                <span className="fw-semibold">{facility.type}</span>
              </td>
              <td>{facility.capacity}</td>
              <td>{facility.responsibleWorker?.name ?? facility.responsibleWorker?.id ?? '-'}</td>
              <td>{facility.assistantWorker?.name ?? facility.assistantWorker?.id ?? '-'}</td>
              <td>
                <span className={`badge ${facility.isActive ? 'bg-success' : 'bg-secondary'}`}>
                  {facility.isActive ? 'Activa' : 'Inactiva'}
                </span>
              </td>
              <td>
                <div className="d-flex gap-1 justify-content-center">
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => onEdit(facility)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
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
        <p className="text-center text-muted py-4 mb-0">No hay instalaciones registradas</p>
      )}
    </div>
  );
}
