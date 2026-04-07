import { Link, useParams, useLocation } from "react-router-dom";
import type { UserResponse } from "../../entities/Entities";
import { useClubIdStore, useUserStore } from "../../store/store";
import EditUserAthleteForm from "../../components/users/EditUserAthleteForm";

export default function EditUserAthleteSpecific() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const identifier = id ? parseInt(id, 10) : NaN;
  const clubId = useClubIdStore((state) => state.clubId);
  const user: UserResponse | null = useUserStore((state) => {
    if (!Number.isNaN(identifier) && clubId > 0) {
      return state.getUser(identifier, clubId);
    }
    return null;
  });

  if (!user || !id) return null;

  const base = location.pathname.includes("/miembros") ? "/miembros" : "/trabajadores";

  return (
    <div className="container max-w-7xl mx-auto py-4 px-3 md:py-5 md:px-4">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="mb-0 text-2xl font-bold tracking-tight text-slate-800">Datos del atleta</h1>
          <Link to={`${base}/editar/${id}/paso-1`} className="pageBackButton shrink-0 self-end sm:self-auto">
            ← Atrás
          </Link>
        </div>
        <EditUserAthleteForm user={user} />
      </div>
    </div>
  );
}
