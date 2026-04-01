import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../../config/axios';
import MembershipTypeList from '../../components/membershipType/MembershipTypeList';
import { useClubIdStore, useMembershipTypeStore } from '../../store/store';
import type { MembershipType } from '../../entities/Entities';

export default function MembershipTypes() {
  const navigate = useNavigate();
  const clubId = useClubIdStore((s) => s.clubId);
  const membershipTypes = useMembershipTypeStore((s) => s.membershipTypes);
  const setMembershipTypes = useMembershipTypeStore((s) => s.setMembershipTypes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clubId <= 0) {
      setError(null);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    AxiosInstance.get<MembershipType[]>(`/membership-type?clubId=${clubId}`)
      .then((res) => {
        if (!cancelled && res.data) {
          const withClub = res.data.map((mt) => ({
            ...mt,
            clubId: mt.clubId ?? clubId,
          }));
          setMembershipTypes(withClub);
        }
      })
      .catch(() => {
        if (!cancelled) setError('No se pudieron cargar los tipos de membresía.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [clubId, setMembershipTypes]);

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

      {error && (
        <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      {loading && clubId > 0 ? (
        <p className="text-sm text-slate-600">Cargando...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
          <div className="p-4 md:p-6">
            <MembershipTypeList items={clubId > 0 ? membershipTypes : []} />
          </div>
        </div>
      )}
    </div>
  );
}
