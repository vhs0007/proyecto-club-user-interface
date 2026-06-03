import { Link, useParams } from "react-router-dom";
import DeleteScheduledActivitiesForm from "../../components/scheduledActivities/DeleteScheduledActivitiesForm";
import { useScheduledActivityStore } from "../../store/store";

export default function DeleteScheduledActivities() {
    const { id } = useParams<{ id: string }>();
    const identifier = id ? parseInt(id, 10) : NaN;

    const scheduledActivity = useScheduledActivityStore((state) => {
        if (!Number.isNaN(identifier)) {
            return state.getScheduledActivity(identifier);
        }
        return null;
    });

    if (!scheduledActivity) {
        return (
            <div className="container py-4">
                <Link to="/actividades-rutinarias" className="pageBackButton mb-3">
                    ← Atrás
                </Link>
                <h1 className="mb-4">Eliminar actividad rutinaria</h1>
                <p className="text-sm text-slate-600">
                    No se encontró la actividad rutinaria. Volvé al listado e intentá de nuevo.
                </p>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <Link to="/actividades-rutinarias" className="pageBackButton mb-3">
                ← Atrás
            </Link>
            <h1 className="mb-4">Eliminar actividad rutinaria</h1>
            <DeleteScheduledActivitiesForm scheduledActivity={scheduledActivity} />
        </div>
    );
}
