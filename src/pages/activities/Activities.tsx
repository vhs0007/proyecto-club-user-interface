import { useEffect, useState } from 'react';
import api from '../../config/api';
import { useAuthStore } from '../../store/store';
import ActivityList from '../../components/activities/ActivityList';
import ActivityFormModal from '../../components/activities/ActivityFormModal';

interface Activity {
  id: number;
  name: string;
  type: string;
  startAt: string;
  endAt: string;
  userId: number;
  cost: number;
  createdAt: string;
  updatedAt: string | null;
  isActive: boolean;
}

export default function Activities() {
  const token = useAuthStore((state) => state.token);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await api.get('/activities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(response.data);
    } catch (err) {
      setError('Error al cargar actividades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleCreate = () => {
    setEditingActivity(null);
    setShowFormModal(true);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setShowFormModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta actividad?')) return;
    
    try {
      await api.delete(`/activities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchActivities();
    } catch (err) {
      setError('Error al eliminar actividad');
    }
  };

  const closeModal = () => {
    setShowFormModal(false);
    setEditingActivity(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestión de Actividades</h2>
        <button className="btn btn-club-primary" onClick={handleCreate}>
          <i className="bi bi-plus-lg me-2"></i>
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

