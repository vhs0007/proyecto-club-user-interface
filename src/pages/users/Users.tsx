import { useEffect, useState } from 'react';
import api from '../../config/axios';
import { useAuthStore } from '../../store/store';
import UserList from '../../components/users/UserList';
import UserFormModal from '../../components/users/UserFormModal';
import UserDetailModal from '../../components/users/UserDetailModal';

interface User {
  id: number;
  name: string;
  type: 'worker' | 'athlete' | 'member';
  email: string | null;
  createdAt: string;
  updatedAt: string | null;
  isActive: boolean;
  role?: string;
  roleId?: number;
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

const TYPE_ID_TO_TYPE: Record<number, 'worker' | 'athlete' | 'member'> = {
  1: 'worker',
  2: 'athlete',
  3: 'member',
};

function normalizeUserFromApi(item: any): User {
  const id = item?.id ?? item?._id;
  const typeId = item?.type ?? item?._type;
  const roleId = item?.role ?? item?._role ?? item?.roleId;
  return {
    id,
    name: item?.name ?? item?._name ?? '',
    type: TYPE_ID_TO_TYPE[typeId] ?? 'member',
    email: item?.email ?? item?._email ?? null,
    createdAt: item?.createdAt ?? item?._createdAt ?? '',
    updatedAt: item?.updatedAt ?? item?._updatedAt ?? null,
    isActive: item?.isActive ?? item?._isActive ?? true,
    role: item?.role && typeof item.role === 'string' ? item.role : undefined,
    roleId: typeof roleId === 'number' ? roleId : undefined,
    salary: item?.salary ?? item?._salary,
    hoursToWorkPerDay: item?.hoursToWorkPerDay ?? item?._hoursToWorkPerDay,
    startWorkAt: item?.startWorkAt ?? item?._startWorkAt,
    endWorkAt: item?.endWorkAt ?? item?._endWorkAt,
    weight: item?.weight ?? item?._weight,
    height: item?.height ?? item?._height,
    gender: item?.gender ?? item?._gender,
    birthDate: item?.birthDate ?? item?._birthDate,
    diet: item?.diet ?? item?._diet,
    trainingPlan: item?.trainingPlan ?? item?._trainingPlan,
    medicalHistory: item?.medicalHistory ?? item?._medicalHistory,
    allergies: item?.allergies ?? item?._allergies,
    medications: item?.medications ?? item?._medications,
    medicalConditions: item?.medicalConditions ?? item?._medicalConditions,
  };
}

export default function Users() {
  const token = useAuthStore((state) => state.token);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const raw = response.data;
      const normalized = Array.isArray(raw) ? raw.map(normalizeUserFromApi) : [];
      setUsers(normalized);
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

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const handleEdit = (user: User) => {
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
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
}
