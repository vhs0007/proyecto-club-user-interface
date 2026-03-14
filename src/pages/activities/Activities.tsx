import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AxiosInstance from '../../config/axios';
import ActivityList from '../../components/activities/ActivityList';
import ActivityFormModal from '../../components/activities/ActivityFormModal';
import type { Activity } from '../../entities/Entities';

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await AxiosInstance.get('/activities');
      const raw = response.data ?? [];
      const mapped: Activity[] = Array.isArray(raw)
        ? raw.map((a: any) => ({
            id: a.id ?? a._id,
            name: a.name ?? a._name,
            type: a.type ?? a._type,
            startAt: a.startAt || a._startAt ? new Date(a.startAt ?? a._startAt).toISOString() : '',
            endAt: a.endAt || a._endAt ? new Date(a.endAt ?? a._endAt).toISOString() : '',
            userId: a.userId ?? a._userId,
            cost: a.cost ?? a._cost ?? null,
            isActive: a.isActive ?? a._isActive ?? true,
          }))
        : [];
      setActivities(mapped);
    } catch (err) {
      setError('Error al cargar actividades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setShowFormModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta actividad?')) return;
    
    try {
      await AxiosInstance.delete(`/activities/${id}`);
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
        <Link to="/actividades/crear" className="btn btn-club-primary">
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

