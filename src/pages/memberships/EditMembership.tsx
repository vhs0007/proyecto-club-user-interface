import EditMembershipForm from "../../components/memberships/EditMembershipForm";
import MembershipLayout from "../../components/memberships/MembershipLayout";
import Navbar from "../../components/shared/Navbar";

export default function EditMembership() {
  return (
    <MembershipLayout>
      <Navbar />
      <div className="container">
        <h1>Editar Membresía</h1>
        <EditMembershipForm />
      </div>
    </MembershipLayout>
  )
}