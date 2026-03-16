import type { UserResponse } from '../../entities/Entities';


interface UserDetailModalProps {
  user: UserResponse;
  onClose: () => void;
}


const genderLabels: Record<string, string> = {
  male: 'Masculino',
  female: 'Femenino',
};

const formatDate = (date: Date | null | undefined): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-ES');
};

export default function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  return (
    <div className="modal fade show d-block modal-backdrop-custom">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">
              <i className="bi bi-person-badge me-2"></i>
              Detalles del Usuario
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header bg-primary bg-opacity-10">
                    <strong>Información General</strong>
                  </div>
                  <div className="card-body">
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Nombre:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email || '-'}</p>
                    <p><strong>Tipo:</strong> {user.type?.name ?? '-'}</p>
                    <p>
                      <strong>Estado:</strong>{' '}
                      <span className={`badge ${user.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </p>
                    {user.gender != null && (
                      <p><strong>Género:</strong> {genderLabels[user.gender] || user.gender}</p>
                    )}
                  </div>
                </div>
              </div>

              {user.type?.name === 'worker' && (
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header bg-warning bg-opacity-10">
                      <strong>Datos Laborales</strong>
                    </div>
                    <div className="card-body">
                      <p><strong>Salario:</strong> ${user.salary?.toLocaleString() || '-'}</p>
                      <p><strong>Horas/día:</strong> {user.hoursToWorkPerDay || '-'}</p>
                      <p><strong>Inicio trabajo:</strong> {formatDate(user.startWorkAt)}</p>
                      <p><strong>Fin trabajo:</strong> {formatDate(user.endWorkAt)}</p>
                    </div>
                  </div>
                </div>
              )}

              {user.type?.name === 'athlete' && (
                <>
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-header bg-success bg-opacity-10">
                        <strong>Datos Físicos</strong>
                      </div>
                      <div className="card-body">
                        <p><strong>Género:</strong> {user.gender ? genderLabels[user.gender] : '-'}</p>
                        <p><strong>Fecha nacimiento:</strong> {formatDate(user.birthDate)}</p>
                        <p><strong>Peso:</strong> {user.weight ? `${user.weight} kg` : '-'}</p>
                        <p><strong>Altura:</strong> {user.height ? `${user.height} cm` : '-'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-header bg-info bg-opacity-10">
                        <strong>Información Médica</strong>
                      </div>
                      <div className="card-body">
                        <p><strong>Dieta:</strong> {user.diet || '-'}</p>
                        <p><strong>Plan de entrenamiento:</strong> {user.trainingPlan || '-'}</p>
                        <p><strong>Historial médico:</strong> {user.medicalHistory || '-'}</p>
                        <p><strong>Alergias:</strong> {user.allergies || '-'}</p>
                        <p><strong>Medicamentos:</strong> {user.medications || '-'}</p>
                        <p><strong>Condiciones:</strong> {user.medicalConditions || '-'}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="col-12">
                <div className="card">
                  <div className="card-header bg-secondary bg-opacity-10">
                    <strong>Fechas del Sistema</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-0"><strong>Creado:</strong> {formatDate(user.createdAt)}</p>
                      </div>
                      <div className="col-md-6">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
