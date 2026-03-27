import { useState } from 'react';
import { Link } from 'react-router-dom';
import ActivityList from '../../components/activities/ActivityList';
import { useActivityStore } from '../../store/store';


export default function Activities() {
  const [error, setError] = useState('');
  
  const activities = useActivityStore.getState().activities;




  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestión de Actividades</h2>
        <Link to="/actividades/crear/paso-1" className="btn btn-club-primary">
          <i className="bi bi-plus-lg me-2"></i>
          Nueva Actividad
        </Link>
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

{/*{showFormModal && (
  <ActivityFormModal
    activity={editingActivity}
    onClose={closeModal}
    onSuccess={fetchActivities}
  />
)}*/}