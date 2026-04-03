import { Link } from "react-router-dom";
import CreateMemberFirstStepForm from '../../components/users/CreateMemberFirstStepForm';


export default function CreateMemberFirstStep() {
  return (
    <div className="container max-w-7xl mx-auto py-4 px-3 md:py-5 md:px-4">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="mb-0 text-2xl font-bold tracking-tight text-slate-800">
            Crear socio
          </h1>
          <Link to="/socios" className="pageBackButton shrink-0 self-end sm:self-auto">
            ← Atrás
          </Link>
        </div>
        <CreateMemberFirstStepForm />
      </div>
    </div>
  )
}
