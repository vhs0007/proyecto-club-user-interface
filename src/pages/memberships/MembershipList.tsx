import { useState, useEffect } from "react";
import MembershipLayout from "../../components/memberships/MembershipLayout";
import MembershipList from "../../components/memberships/MembershipList";
import { useMembershipStore } from "../../store/store";
import type { MembershipResponse } from "../../entities/Entities";
import { useNavigate } from "react-router-dom";

export default function Membership() {
  const navigate = useNavigate();
  const memberships = useMembershipStore((state) => state.memberships);
  const [membershipsList, setMembershipsList] = useState<MembershipResponse[]>([]);
  useEffect(() => {
    setMembershipsList(memberships);
    console.log(memberships);

  }, [memberships]);
  return (
    <MembershipLayout>
      <div className="mx-auto max-w-7xl py-4 px-3 md:py-5 md:px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-slate-200/90">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Membresías
          </h2>
          <button
            type="button"
            className="pageHeaderPrimaryButton"
            onClick={() => navigate('/membresias/crear')}
          >
            <i className="bi bi-plus-lg mr-2" />
            Crear Membresía
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
          <div className="p-4 md:p-6">
            <MembershipList membershipsList={membershipsList} />
          </div>
        </div>
      </div>
    </MembershipLayout>
  )
}