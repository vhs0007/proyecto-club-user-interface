import MembershipLayout from "../../components/memberships/MembershipLayout";
import MembershipList from "../../components/memberships/MembershipList";

export default function Membership() {
  return (
    <MembershipLayout>
      <div className="container">
        <h1>Membresías</h1>
        <MembershipList />
      </div>
    </MembershipLayout>
  )
}