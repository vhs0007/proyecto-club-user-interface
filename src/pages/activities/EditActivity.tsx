import { useParams } from "react-router-dom";
import type { ActivityResponse, Activity } from "../../entities/Entities";
import { useActivityStore } from "../../store/store";
import EditActivityForm from "../../components/activities/EditActivityForm";

export default function EditUserFirstStep() {
  const { id } = useParams<{ id: string }>();
  const identifier = id ? parseInt(id, 10) : NaN;
  const activityres: ActivityResponse | null = useActivityStore((state) => {
    if (!Number.isNaN(identifier)) {
      return state.getActivity(identifier);
    }
    return null;
  });
  const activity : Activity = {
    id: activityres?.id ?? 0,
    clubId: activityres?.clubId ?? 0,
    name: activityres?.name ?? "",
    type: activityres?.type ?? "",
    hourStart: activityres?.hourStart ?? "",
    hourEnd: activityres?.hourEnd ?? "",
    date: activityres?.date ?? new Date(),
    userId: activityres?.user?.id ?? 0,
    cost: activityres?.cost ?? 0,
    facilityId: activityres?.facility?.id ?? 0,
  }

  if (!activity) return null;

  return (
    <div className="container py-4">
      <h1 className="mb-4">Editar usuario</h1>
      <EditActivityForm activity={activity} />
    </div>
  );
}
