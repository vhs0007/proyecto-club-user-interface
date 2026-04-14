import { useParams } from "react-router-dom";
import type { UserResponse } from "../../entities/Entities";
import { useUserStore } from "../../store/store";
import EditMemberFirstStepForm from "../../components/users/EditMemberFirstStepForm";
import { Link } from "react-router-dom";

export default function EditMemberFirstStep() {
  const { id, typeId: typeIdParam } = useParams<{ id: string; typeId: string }>();
  const identifier = id ? parseInt(id, 10) : NaN;
  const typeIdFromRoute = typeIdParam ? parseInt(typeIdParam, 10) : NaN;
  const user: UserResponse | null = useUserStore((state) => {
    if (!Number.isNaN(identifier) && !Number.isNaN(typeIdFromRoute)) {
      return state.getUser(identifier, typeIdFromRoute) ?? null;
    }
    return null;
  });

  if (!user) return null;

  return (
    <div className="container max-w-7xl mx-auto py-4 px-3 md:py-5 md:px-4">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="mb-0 text-2xl font-bold tracking-tight text-slate-800">
            Editar socio
          </h1>
          <Link to="/miembros" className="pageBackButton shrink-0 self-end sm:self-auto">
            ← Atrás
          </Link>
        </div>
        <EditMemberFirstStepForm user={user} />
      </div>
    </div>
  );
}
