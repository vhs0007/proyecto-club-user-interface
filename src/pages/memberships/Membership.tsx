import MembershipLayout from "../../components/memberships/MembershipLayout";
import MembershipList from "../../components/memberships/MembershipList";
import Navbar from "../../components/shared/Navbar";

export default function Membership() {
  return (
    <MembershipLayout>
      <Navbar />
      <div className="container">
        <h1>Membresías</h1>
        <MembershipList />
      </div>
    </MembershipLayout>
  )
}