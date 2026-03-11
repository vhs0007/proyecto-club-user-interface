import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { useAuthStore } from '../../store/store';

interface Activity {
  id: number;
  name: string;
  type: string;
  startAt: string;
  endAt: string;
  userId: number;
  cost: number;
}

interface ActivityFormModalProps {
  activity: Activity | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ActivityFormModal({ activity, onClose, onSuccess }: ActivityFormModalProps) {
  const token = useAuthStore((state) => state.token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');
  const [userId, setUserId] = useState('');
  const [cost, setCost] = useState('');

  const isEditing = activity !== null;

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setType(activity.type);
      setStartAt(activity.startAt.slice(0, 16));
      setEndAt(activity.endAt.slice(0, 16));
      setUserId(activity.userId.toString());
      setCost(activity.cost.toString());
    }
  }, [activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      name,
      type,
      startAt: new Date(startAt).toISOString(),
      endAt: new Date(endAt).toISOString(),
      userId: Number(userId),
      cost: Number(cost),
    };

    try {
      if (isEditing && activity) {
        await api.patch(`/activities/${activity.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/activities', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar actividad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block modal-backdrop-custom">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">
              <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-calendar-plus'} me-2`}></i>
              {isEditing ? 'Editar Actividad' : 'Nueva Actividad'}
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
                <div className="col-12">
                  <label htmlFor="name" className="form-label">Nombre *</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Clase de natación"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="type" className="form-label">Tipo *</label>
                  <input
                    type="text"
                    id="type"
                    className="form-control"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="Ej: Deportiva, Recreativa"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="startAt" className="form-label">Fecha/Hora Inicio *</label>
                  <input
                    type="datetime-local"
                    id="startAt"
                    className="form-control"
                    value={startAt}
                    onChange={(e) => setStartAt(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="endAt" className="form-label">Fecha/Hora Fin *</label>
                  <input
                    type="datetime-local"
                    id="endAt"
                    className="form-control"
                    value={endAt}
                    onChange={(e) => setEndAt(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="userId" className="form-label">Usuario (ID) *</label>
                  <input
                    type="number"
                    id="userId"
                    className="form-control"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="ID del usuario"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="cost" className="form-label">Costo *</label>
                  <input
                    type="number"
                    id="cost"
                    className="form-control"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
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
                  isEditing ? 'Actualizar' : 'Crear'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

