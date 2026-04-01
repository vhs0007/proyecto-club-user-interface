
import { useParams } from 'react-router-dom';
import { useActivityStore } from '../../store/store';
import DeleteActivityForm from '../../components/activities/DeleteActivityForm';
import type { Activity } from '../../entities/Entities';

export default function DeleteActivity() {
  const { id } = useParams<{ id: string }>();
  const identifier = id ? parseInt(id, 10) : NaN;

  const activity = useActivityStore((state) => {
    if (!Number.isNaN(identifier)) {
      return state.getActivity(identifier);
    }
    return null;
  });

  let activityReq : Activity = {
    clubId: 0,
    name: "",
    type: "",
    hourStart: "",
    date: new Date(),
    hourEnd: "",
    userId: 0,
    cost: 0,
    facilityId: 0,
  };
  
  if (!activity) return null;
  if(activity){
    activityReq = {
      id: activity.id,
      name: activity.name,
      type: activity.type,
      date: activity.date,
      hourStart: activity.hourStart,
      hourEnd: activity.hourEnd,
      userId: activity.user.id,
      cost: activity.cost,
      facilityId: activity.facility.id,
      clubId: activity.clubId,
    };
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Eliminar actividad</h1>
      <DeleteActivityForm activity={activityReq} />
    </div>
  );
}
