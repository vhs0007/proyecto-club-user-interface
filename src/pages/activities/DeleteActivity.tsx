
import { useParams } from 'react-router-dom';
import { useActivityStore } from '../../store/store';
import DeleteActivityForm from '../../components/activities/DeleteActivityForm';

export default function DeleteActivity() {
  const { id } = useParams<{ id: string }>();
  const identifier = id ? parseInt(id, 10) : NaN;

  const activity = useActivityStore((state) => {
    if (!Number.isNaN(identifier)) {
      return state.getActivity(identifier);
    }
    return null;
  });

  if (!activity) return null;

  return (
    <div className="container py-4">
      <h1 className="mb-4">Eliminar actividad</h1>
      <DeleteActivityForm activity={activity} />
    </div>
  );
}
