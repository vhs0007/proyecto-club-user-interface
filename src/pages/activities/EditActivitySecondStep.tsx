import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import type { ActivityResponse } from "../../entities/Entities";
import { useActivityStore } from "../../store/store";
import EditActivityFormSecondStep from "../../components/activities/EditActivityFormSecondStep";

export default function EditActivitySecondStep() {
  const { id } = useParams<{ id: string }>();
  const identifier = id ? parseInt(id, 10) : NaN;
  const activity: ActivityResponse | null = useActivityStore((state) => {
    if (!Number.isNaN(identifier)) {
      return state.getActivity(identifier);
    }
    return null;
  });

  if (!activity) return null;

  return (
    <div className="container py-4">
      <Link to="/reservas" className="pageBackButton mb-3">
        ← Atrás
      </Link>
      <h1 className="mb-4">Editar reserva</h1>
      <EditActivityFormSecondStep activity={activity} />
    </div>
  );
}
