import { useEffect, useState } from 'react';
import api from '../../config/axios';
import { useAuthStore } from '../../store/store';
import UserList from '../../components/users/UserList';
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
