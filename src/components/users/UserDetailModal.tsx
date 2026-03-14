import { useUserTypeStore } from '../../store/store';

interface User {
  id: number;
  name: string;
  type: 'worker' | 'athlete' | 'member';
  typeId?: number;
  email: string | null;
  createdAt: string;
  updatedAt: string | null;
  isActive: boolean;
  role?: string;
  roleId?: number;
  salary?: number;
  hoursToWorkPerDay?: number;
  startWorkAt?: string;
  endWorkAt?: string;
  weight?: number;
  height?: number;
  gender?: 'male' | 'female';
  birthDate?: string;
  diet?: string;
  trainingPlan?: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  medicalConditions?: string;
}

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
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

const genderLabels: Record<string, string> = {
  male: 'Masculino',
  female: 'Femenino',
};

const formatDate = (date: string | null | undefined): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-ES');
};

export default function UserDetailModal({ user, onClose }: UserDetailModalProps) {
  const getUserType = useUserTypeStore((state) => state.getUserType);
  const typeDisplay = user.typeId != null ? (getUserType(user.typeId)?.name ?? typeLabels[user.type]) : typeLabels[user.type];
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
                    <p><strong>Tipo:</strong> {typeDisplay}</p>
                    <p><strong>Rol:</strong> {getRoleDisplay(user)}</p>
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

              {user.type === 'worker' && (
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

              {(user.type === 'athlete' || user.role === 'athlete') && (
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
                        <p className="mb-0"><strong>Actualizado:</strong> {formatDate(user.updatedAt)}</p>
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
