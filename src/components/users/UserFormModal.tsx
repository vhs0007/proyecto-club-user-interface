import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { useAuthStore, useUserTypeStore } from '../../store/store';

interface User {
  id: number;
  name: string;
  type: 'worker' | 'athlete' | 'member';
  typeId?: number;
  email: string | null;
  role?: string;
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

interface UserFormModalProps {
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

const memberRoles = ['standard', 'vip', 'athlete'];
const roleLabels: Record<string, string> = {
  standard: 'Estándar',
  vip: 'VIP',
  athlete: 'Atleta',
};

const TYPE_TO_ID: Record<string, number> = {
  worker: 1,
  athlete: 2,
  member: 3,
};

export default function UserFormModal({ user, onClose, onSuccess }: UserFormModalProps) {
  const token = useAuthStore((state) => state.token);
  const userTypes = useUserTypeStore((state) => state.userTypes);
  const getUserType = useUserTypeStore((state) => state.getUserType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [typeId, setTypeId] = useState<number>(0);
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState('');
  const [hoursToWorkPerDay, setHoursToWorkPerDay] = useState('');
  const [startWorkAt, setStartWorkAt] = useState('');
  const [endWorkAt, setEndWorkAt] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [diet, setDiet] = useState('');
  const [trainingPlan, setTrainingPlan] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');

  const isEditing = user !== null;

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email || '');
      setTypeId(user.typeId ?? TYPE_TO_ID[user.type] ?? 0);
      setRole(user.role || '');
      setSalary(user.salary?.toString() || '');
      setHoursToWorkPerDay(user.hoursToWorkPerDay?.toString() || '');
      setStartWorkAt(user.startWorkAt?.split('T')[0] || '');
      setEndWorkAt(user.endWorkAt?.split('T')[0] || '');
      setGender(user.gender || '');
      setBirthDate(user.birthDate?.split('T')[0] || '');
      setWeight(user.weight?.toString() || '');
      setHeight(user.height?.toString() || '');
      setDiet(user.diet || '');
      setTrainingPlan(user.trainingPlan || '');
      setMedicalHistory(user.medicalHistory || '');
      setAllergies(user.allergies || '');
      setMedications(user.medications || '');
      setMedicalConditions(user.medicalConditions || '');
    }
  }, [user]);

  const selectedTypeName = getUserType(typeId)?.name?.toLowerCase() ?? '';
  const isWorker = selectedTypeName === 'worker';
  const isAthlete = selectedTypeName === 'athlete' || role === 'athlete';
  const isMemberRoleVisible = !isWorker;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload: any = {
      name,
      typeId: typeId || undefined,
      isActive: isEditing ? undefined : true,
      email: email || undefined,
    };

    if (password) payload.password = password;

    if (isWorker) {
      if (salary) payload.salary = Number(salary);
      if (hoursToWorkPerDay) payload.hoursToWorkPerDay = Number(hoursToWorkPerDay);
      if (startWorkAt) payload.startWorkAt = new Date(startWorkAt).toISOString();
      if (endWorkAt) payload.endWorkAt = new Date(endWorkAt).toISOString();
    }

    if (isAthlete) {
      if (weight) payload.weight = Number(weight);
      if (height) payload.height = Number(height);
      if (gender) payload.gender = gender;
      if (birthDate) payload.birthDate = new Date(birthDate).toISOString();
      if (diet) payload.diet = diet;
      if (trainingPlan) payload.trainingPlan = trainingPlan;
      if (medicalHistory) payload.medicalHistory = medicalHistory;
      if (allergies) payload.allergies = allergies;
      if (medications) payload.medications = medications;
      if (medicalConditions) payload.medicalConditions = medicalConditions;
    }

    try {
      if (isEditing && user) {
        await api.patch(`/users/${user.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/users', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block modal-backdrop-custom">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">
              <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-person-plus'} me-2`}></i>
              {isEditing ? 'Editar Usuario' : 'Registrar Usuario'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2 mb-3">
                  {error}
                </div>
              )}
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label">Nombre *</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="password" className="form-label">
                    Contraseña {isEditing ? '(dejar vacío para no cambiar)' : '*'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={!isEditing}
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="type" className="form-label">Tipo de Usuario *</label>
                  <select
                    id="type"
                    className="form-select"
                    value={typeId}
                    onChange={(e) => setTypeId(Number(e.target.value))}
                    required
                  >
                    <option value={0}>Seleccionar...</option>
                    {userTypes.map((ut) => (
                      <option key={ut.id} value={ut.id}>{ut.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="role" className="form-label">Rol</label>
                  <select
                    id="role"
                    className="form-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Seleccionar rol</option>
                    {isMemberRoleVisible && memberRoles.map((r) => (
                      <option key={r} value={r}>{roleLabels[r]}</option>
                    ))}
                  </select>
                </div>

                {isWorker && (
                  <>
                    <div className="col-12">
                      <hr />
                      <h6 className="text-muted">Datos Laborales</h6>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="salary" className="form-label">Salario</label>
                      <input
                        type="number"
                        id="salary"
                        className="form-control"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="hoursToWorkPerDay" className="form-label">Horas/día</label>
                      <input
                        type="number"
                        id="hoursToWorkPerDay"
                        className="form-control"
                        value={hoursToWorkPerDay}
                        onChange={(e) => setHoursToWorkPerDay(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="startWorkAt" className="form-label">Inicio</label>
                      <input
                        type="date"
                        id="startWorkAt"
                        className="form-control"
                        value={startWorkAt}
                        onChange={(e) => setStartWorkAt(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="endWorkAt" className="form-label">Fin</label>
                      <input
                        type="date"
                        id="endWorkAt"
                        className="form-control"
                        value={endWorkAt}
                        onChange={(e) => setEndWorkAt(e.target.value)}
                      />
                    </div>
                  </>
                )}

                {isAthlete && (
                  <>
                    <div className="col-12">
                      <hr />
                      <h6 className="text-muted">Datos del Atleta</h6>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="gender" className="form-label">Género</label>
                      <select
                        id="gender"
                        className="form-select"
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="">Seleccionar</option>
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="birthDate" className="form-label">Fecha nacimiento</label>
                      <input
                        type="date"
                        id="birthDate"
                        className="form-control"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="weight" className="form-label">Peso (kg)</label>
                      <input
                        type="number"
                        id="weight"
                        className="form-control"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="height" className="form-label">Altura (cm)</label>
                      <input
                        type="number"
                        id="height"
                        className="form-control"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="diet" className="form-label">Dieta</label>
                      <textarea
                        id="diet"
                        className="form-control"
                        rows={2}
                        value={diet}
                        onChange={(e) => setDiet(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="trainingPlan" className="form-label">Plan de entrenamiento</label>
                      <textarea
                        id="trainingPlan"
                        className="form-control"
                        rows={2}
                        value={trainingPlan}
                        onChange={(e) => setTrainingPlan(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="medicalHistory" className="form-label">Historial médico</label>
                      <textarea
                        id="medicalHistory"
                        className="form-control"
                        rows={2}
                        value={medicalHistory}
                        onChange={(e) => setMedicalHistory(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="allergies" className="form-label">Alergias</label>
                      <textarea
                        id="allergies"
                        className="form-control"
                        rows={2}
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="medications" className="form-label">Medicamentos</label>
                      <textarea
                        id="medications"
                        className="form-control"
                        rows={2}
                        value={medications}
                        onChange={(e) => setMedications(e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="medicalConditions" className="form-label">Condiciones médicas</label>
                      <textarea
                        id="medicalConditions"
                        className="form-control"
                        rows={2}
                        value={medicalConditions}
                        onChange={(e) => setMedicalConditions(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-club-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Guardando...
                  </>
                ) : (
                  isEditing ? 'Actualizar' : 'Registrar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
