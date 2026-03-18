import UserList from '../../components/users/UserList';
import { useNavigate } from 'react-router-dom';



export default function Users() {
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Gestión de Usuarios</h2>
        <button className="btn btn-club-primary" onClick={() => navigate('/usuarios/crear/paso-general')}>
          <i className="bi bi-plus-lg me-2"></i>
          Nuevo Usuario
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <UserList
          />
        </div>
      </div>

    </div>
  );
}
