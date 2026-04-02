import { Link, useSearchParams } from "react-router-dom";
import CreateUserFirstStepForm from '../../components/users/CreateUserFirstStepForm';


export default function CreateUserFirstStep() {
  const [searchParams] = useSearchParams();
  const raw = searchParams.get('typeId');
  const typeId = raw === '1' || raw === '2' ? Number(raw) : 1;

  return (
    <div className="container max-w-7xl mx-auto py-4 px-3 md:py-5 md:px-4">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="mb-0 text-2xl font-bold tracking-tight text-slate-800">
            Crear usuario
          </h1>
          <Link to="/usuarios" className="pageBackButton shrink-0 self-end sm:self-auto">
            ← Atrás
          </Link>
        </div>
        <CreateUserFirstStepForm typeId={typeId} />
      </div>
    </div>
  )
}
