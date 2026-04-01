import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ActivityList from '../../components/activities/ActivityList';
import { useActivityStore } from '../../store/store';


export default function Activities() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const activities = useActivityStore.getState().activities;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestión de Actividades</h2>
        <button
          type="button"
          className="pageHeaderPrimaryButton"
          onClick={() => navigate('/actividades/crear/paso-1')}
        >
          <i className="bi bi-plus-lg mr-2"></i>
          Nueva Actividad
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
          <ActivityList
            activities={activities}
          />
        </div>
      </div>

    </div>
  );
}
