import UserListWorkers from '../../components/users/UserListWorkers';
import { useNavigate } from 'react-router-dom';

export default function WorkerList() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-7xl mx-auto py-4 px-3 md:py-5 md:px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-slate-200/90">
        <h2 className="mb-0 text-2xl font-bold tracking-tight text-slate-800">
          Gestión de Trabajadores
        </h2>
        <button
          type="button"
          className="pageHeaderPrimaryButton"
          onClick={() => navigate(`/usuarios/crear/paso-general`)}
        >
          <i className="bi bi-plus-lg mr-2"></i>
          Nuevo Trabajador
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
        <div className="p-4 md:p-6">
          <div className="mb-4 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            <button
              type="button"
              className='rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800'
            >
              Trabajadores
            </button>
            <button
              type="button"
              className='rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800'
            >
              Socios
            </button>
          </div>
          <UserListWorkers />
        </div>
      </div>
    </div>
  );
}
