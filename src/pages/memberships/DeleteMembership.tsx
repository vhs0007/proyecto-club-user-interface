import DeleteMembershipForm from "../../components/memberships/DeleteMembershipForm";
import MembershipLayout from "../../components/memberships/MembershipLayout";
import Navbar from "../../components/shared/Navbar";

export default function DeleteMembership() {
  return (
    <MembershipLayout>
      <Navbar />
      <div className="container">
        <h1>Eliminar Membresía</h1>
        <DeleteMembershipForm />
      </div>
    </MembershipLayout>
  )
}