import DeleteMembershipForm from "../../components/memberships/DeleteMembershipForm";
import MembershipLayout from "../../components/memberships/MembershipLayout";

export default function DeleteMembership() {
  return (
    <MembershipLayout>
      <div className="container">
        <h1>Eliminar Membresía</h1>
        <DeleteMembershipForm />
      </div>
    </MembershipLayout>
  )
}