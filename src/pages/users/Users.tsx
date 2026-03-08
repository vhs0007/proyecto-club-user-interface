import { useEffect, useState } from 'react';
import api from '../config/api';
import { useAuthStore } from '../store/authStore';
import UserList from '../components/users/UserList';
import UserDetailModal from '../components/users/UserDetailModal';
import UserFormModal from '../components/users/UserFormModal';

interface User {
  id: number;
  name: string;
  type: 'worker' | 'athlete' | 'member';
  email: string | null;
  createdAt: string;
  updatedAt: string | null;
  isActive: boolean;
  role?: string;
  salary?: number;
  hoursToWorkPerDay?: number;
  startWorkAt?: string;
  endWorkAt?: string;
  weight?: number;
  height?: number;
  gender?: 'male' | 'female';
  birthDate?: string;
  diet?: string;
  trainingPlan?: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  medicalConditions?: string;
}

export default function Users() {
  const token = useAuthStore((state) => state.token);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowFormModal(true);
  };

  const handleCreate = () => {
    setEditingUser(null);
    setShowFormModal(true);
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm('¿Estás seguro de dar de baja a este usuario?')) return;
    
    try {
      await api.patch(`/users/${id}`, { isActive: false }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      setError('Error al dar de baja al usuario');
    }
  };

  const closeModals = () => {
    setShowDetailModal(false);
    setShowFormModal(false);
    setSelectedUser(null);
    setEditingUser(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestión de Usuarios</h2>
        <button className="btn btn-club-primary" onClick={handleCreate}>
          <i className="bi bi-plus-lg me-2"></i>
          Registrar Usuario
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
          <UserList
            users={users}
            loading={loading}
            onViewDetails={handleViewDetails}
            onEdit={handleEdit}
            onDeactivate={handleDeactivate}
          />
        </div>
      </div>

      {showDetailModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={closeModals}
        />
      )}

      {showFormModal && (
        <UserFormModal
          user={editingUser}
          onClose={closeModals}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
}
