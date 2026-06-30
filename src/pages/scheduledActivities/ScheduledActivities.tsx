import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduledActivityList from '../../components/scheduledActivities/ScheduledActivityList';
import { useScheduledActivityStore } from '../../store/store';

export default function ScheduledActivities() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const scheduledActivities = useScheduledActivityStore.getState().scheduledActivities;

  useEffect(() => {
    const items = useScheduledActivityStore.getState().scheduledActivities;
    console.log('[ScheduledActivities] scheduledActivities', items);
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Actividades rutinarias</h2>
        <button
          type="button"
          className="pageHeaderPrimaryButton"
          onClick={() => navigate('/actividades-rutinarias/crear/paso-1')}
        >
          <i className="bi bi-plus-lg mr-2"></i>
          Nueva actividad rutinaria
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Cerrar"></button>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <ScheduledActivityList scheduledActivities={scheduledActivities} />
        </div>
      </div>
    </div>
  );
}
