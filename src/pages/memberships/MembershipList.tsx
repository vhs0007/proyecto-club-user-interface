import { useState, useEffect } from "react";
import MembershipLayout from "../../components/memberships/MembershipLayout";
import MembershipList from "../../components/memberships/MembershipList";
import { useMembershipStore } from "../../store/store";
import type { MembershipResponse } from "../../entities/Entities";

export default function Membership() {
  const memberships = useMembershipStore((state) => state.memberships);
  const [membershipsList, setMembershipsList] = useState<MembershipResponse[]>([]);
  useEffect(() => {
    setMembershipsList(memberships);
    console.log(memberships);


  }, [memberships]);
  return (
    <MembershipLayout>
      <div className="container">
        <h1>Membresías</h1>
        <MembershipList membershipsList={membershipsList} />
      </div>
    </MembershipLayout>
  )
}