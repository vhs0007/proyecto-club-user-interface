import { useParams } from "react-router-dom";
import type { UserResponse } from "../../entities/Entities";
import { useUserStore } from "../../store/store";
import EditWorkerFirstStepForm from "../../components/users/EditWorkerFirstStepForm";
import { Link } from "react-router-dom";

export default function EditWorkerFirstStep() {
  const { id } = useParams<{ id: string }>();
  const identifier = id ? parseInt(id, 10) : NaN;
  const user: UserResponse | null = useUserStore((state) => {
    if (!Number.isNaN(identifier)) {
      return state.getUser(identifier);
    }
    return null;
  });

  if (!user) return null;

  return (
    <div className="container max-w-7xl mx-auto py-4 px-3 md:py-5 md:px-4">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="mb-0 text-2xl font-bold tracking-tight text-slate-800">
            Editar trabajador
          </h1>
          <Link to="/trabajadores" className="pageBackButton shrink-0 self-end sm:self-auto">
            ← Atrás
          </Link>
        </div>
        <EditWorkerFirstStepForm user={user} />
      </div>
    </div>
  );
}
