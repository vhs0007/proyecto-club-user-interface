import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ActivityList from '../../components/activities/ActivityList';
import ActivityFormModal from '../../components/activities/ActivityFormModal';
import type { Activity, ActivityResponse } from '../../entities/Entities';
import { useActivityStore } from '../../store/store';


export default function Activities() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const activities = useActivityStore.getState().activities;
  
  const handleEdit = (activity: ActivityResponse) => {
    setEditingActivity(activity);
    setShowFormModal(true);
  };

  const handleDelete = async (id: number) => {
    
  };

  const closeModal = () => {
    setShowFormModal(false);
    setEditingActivity(null);
  };

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
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-warning" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <ActivityList
              activities={activities}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {showFormModal && (
        <ActivityFormModal
          activity={editingActivity}
          onClose={closeModal}
          onSuccess={fetchActivities}
        />
      )}
    </div>
  );
}

