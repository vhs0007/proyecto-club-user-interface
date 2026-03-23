import { useParams } from "react-router-dom";
import type { Activity } from "../../entities/Entities";
import { useActivityStore } from "../../store/store";
import EditActivityForm from "../../components/activities/EditActivityForm";

export default function EditUserFirstStep() {
  const { id } = useParams<{ id: string }>();
  const identifier = id ? parseInt(id, 10) : NaN;
  const activity: Activity | null = useActivityStore((state) => {
    if (!Number.isNaN(identifier)) {
      return state.getActivity(identifier);
    }
    return null;
  });

  if (!activity) return null;

  return (
    <div className="container py-4">
      <h1 className="mb-4">Editar usuario</h1>
      <EditActivityForm activity={activity} />
    </div>
  );
}
