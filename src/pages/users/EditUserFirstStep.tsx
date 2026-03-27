import { useParams } from "react-router-dom";
import type { UserResponse } from "../../entities/Entities";
import { useUserStore } from "../../store/store";
import EditUserFormFirstStep from "../../components/users/EditUserFormFirstStep";
import { Link } from "react-router-dom";

export default function EditUserFirstStep() {
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
    <div className="container py-4">
      <Link to="/usuarios" className="pageBackButton mb-3">
        ← Atrás
      </Link>
      <h1 className="mb-4">Editar usuario</h1>
      <EditUserFormFirstStep user={user} />
    </div>
  );
}
