interface Facility {
  id: number;
  tipo: string;
  horarioDisponible: string;
  aforo: number;
  trabajadorEncargado: number;
  trabajadorAyudante: number | null;
  isActive: boolean;
}

interface FacilityListProps {
  facilities: Facility[];
  onEdit: (facility: Facility) => void;
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
            <th>Horario</th>
            <th>Aforo</th>
            <th>Encargado</th>
            <th>Ayudante</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((facility) => (
            <tr key={facility.id}>
              <td>{facility.id}</td>
              <td>
                <span className="fw-semibold">{facility.tipo}</span>
              </td>
              <td>{facility.horarioDisponible}</td>
              <td>{facility.aforo}</td>
              <td>{facility.trabajadorEncargado}</td>
              <td>{facility.trabajadorAyudante || '-'}</td>
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

