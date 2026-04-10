import { useState, useEffect } from 'react';
import AxiosInstance from '../../config/axios';
import type { Activity } from '../../entities/Entities';
import { useClubIdStore } from '../../store/store';

interface ActivityFormModalProps {
  activity: Activity | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ActivityFormModal({ activity, onClose, onSuccess }: ActivityFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const clubIdFromStore = useClubIdStore((s) => s.clubId);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [hourStart, setHourStart] = useState('');
  const [hourEnd, setHourEnd] = useState('');
  const [userId, setUserId] = useState('');
  const [cost, setCost] = useState('');

  const isEditing = activity !== null;

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setType(activity.type);
      setDate(activity.date.toString());
      setHourStart(activity.hourStart);
      setHourEnd(activity.hourEnd);
      setUserId(activity.userId.toString());
      setCost(activity.cost.toString());
    }
  }, [activity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const dateDate = new Date(date);
    const hourStartDate = new Date(hourStart);
    const hourEndDate = new Date(hourEnd);

    if (Number.isNaN(dateDate.getTime()) || Number.isNaN(hourStartDate.getTime()) || Number.isNaN(hourEndDate.getTime())) {
      setError('Las fechas no son válidas. Revisá inicio y fin.');
      setLoading(false);
      return;
    }

    const payload = {
      name,
      type,
      date: dateDate.toISOString(),
      hourStart: hourStartDate.toISOString(),
      hourEnd: hourEndDate.toISOString(),
      userId: Number(userId),
      cost: Number(cost),
    };

    try {
      if (isEditing && activity) {
        const clubId = activity.clubId ?? clubIdFromStore;
        if (!clubId) {
          setError('No se pudo determinar el club de la reserva');
          setLoading(false);
          return;
        }
        console.log('[ActivityFormModal] PATCH payload', payload);
        const response = await AxiosInstance.patch(`/activities/${activity.id}?clubId=${clubId}`, payload);
        console.log('[EditActivity] response data', response.data);
      } else {
        console.log('[ActivityFormModal] POST payload', payload);
        const response = await AxiosInstance.post('/activities', payload);
        console.log('[CreateActivityModal] response data', response.data);
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('[ActivityFormModal] error', error);
      console.error('[ActivityFormModal] response data', error?.response?.data);
      setError(error?.response?.data?.message || 'Error al guardar reserva');
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
              {isEditing ? 'Editar Reserva' : 'Nueva Reserva'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {error}
                </div>
              )}
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="name" className="activityFormLabel">Nombre *</label>
                  <input
                    type="text"
                    id="name"
                    className="activityFormControl"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Clase de natación"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="type" className="activityFormLabel">Tipo *</label>
                  <input
                    type="text"
                    id="type"
                    className="activityFormControl"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="Ej: Deportiva, Recreativa"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="date" className="activityFormLabel">Fecha *</label>
                  <input
                    type="date"
                    id="date"
                    className="activityFormControl"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="hourStart" className="activityFormLabel">Hora Inicio *</label>
                  <input
                    type="time"
                    id="hourStart"
                    className="activityFormControl"
                    value={hourStart}
                    onChange={(e) => setHourStart(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="hourEnd" className="activityFormLabel">Hora Fin *</label>
                  <input
                    type="time"
                    id="hourEnd"
                    className="activityFormControl"
                    value={hourEnd}
                    onChange={(e) => setHourEnd(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="userId" className="activityFormLabel">Usuario (ID) *</label>
                  <input
                    type="number"
                    id="userId"
                    className="activityFormControl"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="ID del usuario"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="cost" className="activityFormLabel">Costo *</label>
                  <input
                    type="number"
                    id="cost"
                    className="activityFormControl"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="activitySecondaryButton" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="activityPrimaryButton" disabled={loading}>
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