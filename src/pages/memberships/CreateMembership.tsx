import CreateMembershipForm from "../../components/memberships/CreateMembershipForm";
import MembershipLayout from "../../components/memberships/MembershipLayout";

export default function CreateMembership() {
  return (
    <MembershipLayout>
      <div className="container">
        <h1>Crear Membresía</h1>
        <CreateMembershipForm />
      </div>
    </MembershipLayout>
  )
}