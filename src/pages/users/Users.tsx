import UserList from '../../components/users/UserList';
import { useNavigate } from 'react-router-dom';



export default function Users() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-7xl mx-auto py-4 px-3 md:py-5 md:px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-slate-200/90">
        <h2 className="mb-0 text-2xl font-bold tracking-tight text-slate-800">
          Gestión de Usuarios
        </h2>
        <button
          type="button"
          className="pageHeaderPrimaryButton"
          onClick={() => navigate('/usuarios/crear/paso-general')}
        >
          <i className="bi bi-plus-lg mr-2"></i>
          Nuevo Usuario
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
        <div className="p-4 md:p-6">
          <UserList
          />
        </div>
      </div>

    </div>
  );
}
