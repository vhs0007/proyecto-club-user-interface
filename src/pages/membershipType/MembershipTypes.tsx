import { useNavigate } from 'react-router-dom';
import MembershipTypeList from '../../components/membershipType/MembershipTypeList';
import { useClubIdStore, useMembershipTypeStore } from '../../store/store';

export default function MembershipTypes() {
  const navigate = useNavigate();
  const clubId = useClubIdStore((s) => s.clubId);
  const membershipTypes = useMembershipTypeStore((s) => s.membershipTypes);
  const itemsForClub = clubId > 0 ? membershipTypes.filter((mt) => mt.clubId === clubId) : [];

  return (
    <div className="mx-auto max-w-7xl py-4 px-3 md:py-5 md:px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-slate-200/90">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800">Tipos de membresía</h2>
        <button
          type="button"
          className="pageHeaderPrimaryButton"
          onClick={() => navigate('/tipos-membresia/crear')}
          disabled={clubId <= 0}
        >
          <i className="bi bi-plus-lg mr-2" />
          Nuevo tipo
        </button>
      </div>

      {clubId <= 0 && (
        <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          No hay club seleccionado. Sincronizá datos desde la pantalla de sincronización para usar este módulo.
        </p>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
        <div className="p-4 md:p-6">
          <MembershipTypeList items={itemsForClub} />
        </div>
      </div>
    </div>
  );
}
