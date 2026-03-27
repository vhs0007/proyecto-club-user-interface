import CreateMembershipForm from "../../components/memberships/CreateMembershipForm";
import MembershipLayout from "../../components/memberships/MembershipLayout";
import { Link } from "react-router-dom";

export default function CreateMembership() {
  return (
    <MembershipLayout>
      <div className="mx-auto max-w-7xl py-4 px-3 md:py-5 md:px-4">
        <Link to="/membresias" className="pageBackButton mb-3">
          ← Atrás
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-slate-200/90">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Crear Membresía
          </h2>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
          <div className="p-4 md:p-6">
            <CreateMembershipForm />
          </div>
        </div>
      </div>
    </MembershipLayout>
  )
}