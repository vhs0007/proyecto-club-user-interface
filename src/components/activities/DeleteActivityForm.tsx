import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivityStore } from '../../store/store';
import type { Activity } from '../../entities/Entities';
import AxiosInstance from '../../config/axios';

export default function DeleteActivityForm({ activity }: { activity: Activity }) {
  const navigate = useNavigate();
  const deleteActivity = useActivityStore((state) => state.deleteActivity);
  console.log(activity);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activity?.id == null) return;

    setLoading(true);
    setError(null);

    try {
      await AxiosInstance.delete(`/activities/${activity.id}`);
      deleteActivity(activity.id);
      navigate('/actividades');
    } catch {
      setError('No se pudo eliminar la actividad. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!activity) return null;

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-3">¿Estás seguro de que querés eliminar esta actividad?</p>

      <div className="mb-3">
        <label className="form-label">ID</label>
        <input
          type="number"
          value={activity.id ?? ''}
          disabled
          readOnly
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input type="text" value={activity.name} disabled readOnly className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Tipo</label>
        <input type="text" value={activity.type} disabled readOnly className="form-control" />
      </div>

      {error && <p className="text-danger mb-2">{error}</p>}

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-danger" disabled={loading || activity.id == null}>
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/actividades')}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
