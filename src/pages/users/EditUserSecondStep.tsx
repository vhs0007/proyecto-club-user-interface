import { useParams } from "react-router-dom";
import type { UserResponse } from "../../entities/Entities";
import { useUserStore } from "../../store/store";
import EditUserFormSecondStep from "../../components/users/EditUserFormSecondStep";

export default function EditUserSecondStep() {
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
      <h1 className="mb-4">Editar usuario</h1>
      <EditUserFormSecondStep user={user} />
    </div>
  );
}
