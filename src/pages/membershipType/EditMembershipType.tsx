import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AxiosInstance from '../../config/axios';
import EditMembershipTypeForm from '../../components/membershipType/EditMembershipTypeForm';
import { useClubIdStore, useMembershipTypeStore } from '../../store/store';
import type { MembershipType } from '../../entities/Entities';

export default function EditMembershipType() {
  const { id } = useParams<{ id: string }>();
  const identifier = id ? parseInt(id, 10) : NaN;
  const getMembershipType = useMembershipTypeStore((s) => s.getMembershipType);
  const clubId = useClubIdStore((s) => s.clubId);
  const [mt, setMt] = useState<MembershipType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (Number.isNaN(identifier)) {
      setMt(null);
      setLoading(false);
      return;
    }
    const fromStore = getMembershipType(identifier);
    if (fromStore) {
      setMt(fromStore);
      setLoading(false);
      return;
    }
    AxiosInstance.get<MembershipType>(`/membership-type/${identifier}`)
      .then((res) => {
        if (res.data) {
          const withClub: MembershipType = {
            ...res.data,
            clubId: res.data.clubId ?? clubId,
          };
          setMt(withClub);
          const list = useMembershipTypeStore.getState().membershipTypes;
          if (!list.some((m) => m.id === withClub.id)) {
            useMembershipTypeStore.getState().setMembershipType(withClub);
          }
        }
      })
      .catch(() => setMt(null))
      .finally(() => setLoading(false));
  }, [identifier, getMembershipType, clubId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl py-4 px-3">
        <p className="text-sm text-slate-600">Cargando...</p>
      </div>
    );
  }

  if (!mt) {
    return (
      <div className="mx-auto max-w-7xl py-4 px-3">
        <Link to="/tipos-membresia" className="pageBackButton mb-3">
          ← Volver al listado
        </Link>
        <p className="text-slate-600">No se encontró el tipo de membresía.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl py-4 px-3 md:py-5 md:px-4">
      <Link to="/tipos-membresia" className="pageBackButton mb-3">
        ← Atrás
      </Link>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-800">Editar tipo de membresía</h1>
      <EditMembershipTypeForm membershipType={mt} />
    </div>
  );
}
