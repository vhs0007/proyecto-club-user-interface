import EditMembershipForm from "../../components/memberships/EditMembershipForm";
import MembershipLayout from "../../components/memberships/MembershipLayout";

export default function EditMembership() {
  return (
    <MembershipLayout>
      <div className="container">
        <h1>Editar Membresía</h1>
        <EditMembershipForm />
      </div>
    </MembershipLayout>
  )
}