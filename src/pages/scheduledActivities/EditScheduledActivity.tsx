import { Link, useParams } from "react-router-dom";
import EditScheduledActivityForm from "../../components/scheduledActivities/EditScheduledActivityForm";
import { useScheduledActivityStore } from "../../store/store";

export default function EditScheduledActivity() {
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
                <h1 className="mb-4">Editar actividad rutinaria</h1>
                <p className="text-sm text-slate-600">
                    No se encontró la actividad rutinaria. Sincronizá o volvé al listado.
                </p>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <Link to="/actividades-rutinarias" className="pageBackButton mb-3">
                ← Atrás
            </Link>
            <h1 className="mb-4">Editar actividad rutinaria</h1>
            <EditScheduledActivityForm scheduledActivity={scheduledActivity} />
        </div>
    );
}
