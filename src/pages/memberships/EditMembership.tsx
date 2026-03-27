import EditMembershipForm from "../../components/memberships/EditMembershipForm";
import MembershipLayout from "../../components/memberships/MembershipLayout";
import { Link, useParams } from "react-router-dom";
import type { MembershipResponse } from "../../entities/Entities";
import { useState, useEffect } from "react";
import { useMembershipStore } from "../../store/store";

export default function EditMembership() {
  const { id } = useParams<{ id: string }>();
  const [membership, setMembership] = useState<MembershipResponse | null>(null);

  useEffect(() => {
    if (!id) return;
    const identifier = parseInt(id, 10);
    if (Number.isNaN(identifier)) return;
    const found = useMembershipStore.getState().getMembership(identifier);
    setMembership(found ?? null);
  }, [id]);

  return (
    <MembershipLayout>
      <div className="mx-auto max-w-7xl py-4 px-3 md:py-5 md:px-4">
        <Link to="/membresias" className="pageBackButton mb-3">
          ← Atrás
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-slate-200/90">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Editar Membresía
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
          <div className="p-4 md:p-6">
            <EditMembershipForm membership={membership} />
          </div>
        </div>
      </div>
    </MembershipLayout>
  )
}