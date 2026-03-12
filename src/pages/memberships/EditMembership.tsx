import EditMembershipForm from "../../components/memberships/EditMembershipForm";
import MembershipLayout from "../../components/memberships/MembershipLayout";
import { useParams } from "react-router-dom";
import type { Membership } from "../../entities/Entities";
import { useState, useEffect } from "react";
import { useMembershipStore } from "../../store/store";

export default function EditMembership() {
  const { id } = useParams<{ id: string }>();
  const [membership, setMembership] = useState<Membership | null>(null);

  useEffect(() => {
    if (!id) return;
    const identifier = parseInt(id, 10);
    if (Number.isNaN(identifier)) return;
    const found = useMembershipStore.getState().getMembership(identifier);
    setMembership(found ?? null);
  }, [id]);

  return (
    <MembershipLayout>
      <div className="container">
        <h1>Editar Membresía</h1>
        <EditMembershipForm membership={membership} />
      </div>
    </MembershipLayout>
  )
}