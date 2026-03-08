import CreateMembershipForm from "../../components/memberships/CreateMembershipForm";
import MembershipLayout from "../../components/memberships/MembershipLayout";
import Navbar from "../../components/shared/Navbar";

export default function CreateMembership() {
  return (
    <MembershipLayout>
      <Navbar />
      <div className="container">
        <h1>Crear Membresía</h1>
        <CreateMembershipForm />
      </div>
    </MembershipLayout>
  )
}