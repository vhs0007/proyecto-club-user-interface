import { useEffect, useState } from 'react';
import api from '../config/api';
import { useAuthStore } from '../store/authStore';
import FacilityList from '../components/facilities/FacilityList';
import FacilityFormModal from '../components/facilities/FacilityFormModal';

interface Facility {
  id: number;
  tipo: string;
  horarioDisponible: string;
  aforo: number;
  trabajadorEncargado: number;
  trabajadorAyudante: number | null;
  isActive: boolean;
}

export default function Facilities() {
  const token = useAuthStore((state) => state.token);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const response = await api.get('/facilities', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFacilities(response.data);
    } catch (err) {
      setError('Error al cargar instalaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleCreate = () => {
    setEditingFacility(null);
    setShowFormModal(true);
  };

  const handleEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setShowFormModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta instalación?')) return;
    
    try {
      await api.delete(`/facilities/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFacilities();
    } catch (err) {
      setError('Error al eliminar instalación');
    }
  };

  const closeModal = () => {
    setShowFormModal(false);
    setEditingFacility(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestión de Instalaciones</h2>
        <button className="btn btn-club-primary" onClick={handleCreate}>
          <i className="bi bi-plus-lg me-2"></i>
          Nueva Instalación
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
            <FacilityList
              facilities={facilities}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {showFormModal && (
        <FacilityFormModal
          facility={editingFacility}
          onClose={closeModal}
          onSuccess={fetchFacilities}
        />
      )}
    </div>
  );
}
