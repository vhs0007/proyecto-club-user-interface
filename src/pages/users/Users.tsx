import { useEffect, useState } from 'react';
import api from '../../config/axios';
import { useAuthStore } from '../../store/store';
import UserList from '../../components/users/UserList';
import UserFormModal from '../../components/users/UserFormModal';
import UserDetailModal from '../../components/users/UserDetailModal';
import type { User } from '../../entities/Entities';
import type { UserResponse } from '../../entities/Entities';


export default function Users() {
  const token = useAuthStore((state) => state.token);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = response.data;
      setUsers(raw);
    } catch (err) {
      setError('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setShowFormModal(true);
  };

  const handleViewDetails = (user: UserResponse) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleEdit = (user: User | null) => {
    setEditingUser(user);
    setShowFormModal(true);
  };

  const handleDeactivate = async (id: number) => {
    if (!confirm('¿Estás seguro de dar de baja a este usuario? Se marcará como inactivo.')) return;

    try {
      await api.patch(`/users/${id}`, { isActive: false }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      setError('Error al dar de baja al usuario');
    }
  };

  const closeModal = () => {
    setShowFormModal(false);
    setEditingUser(null);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestión de Usuarios</h2>
        <button className="btn btn-club-primary" onClick={handleCreate}>
          <i className="bi bi-plus-lg me-2"></i>
          Nuevo Usuario
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
            <UserList
              users={users}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDeactivate}
            />
          )}
        </div>
      </div>

      {showDetailModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={closeDetailModal}
        />
      )}

      {showFormModal && (
        <UserFormModal
          user={editingUser}
          onClose={closeModal}
          onSuccess={(userFromServer) => {
            if (userFromServer.id != null) {
              setUsers((prev) => {
                const idx = prev.findIndex((u) => u.id === userFromServer.id);
                if (idx >= 0) return prev.map((u) => (u.id === userFromServer.id ? userFromServer : u));
                return [...prev, userFromServer];
              });
            } else {
              fetchUsers();
            }
          }}
        />
      )}
    </div>
  );
}
