import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../config/axios";
import type {
    DatetimeScheduledActivityNavigation,
    ScheduledActivityQuery,
    ScheduledActivityResponse,
} from "../../entities/Entities";
import { useClubIdStore, useScheduledActivityStore } from "../../store/store";

function formatSchedules(datetimes: DatetimeScheduledActivityNavigation[]): string {
    if (!datetimes?.length) return "-";
    return datetimes
        .map((d) => `${d.workingDay?.dayOfWeek ?? "-"} ${d.hourStart} - ${d.hourEnd}`)
        .join(", ");
}

function formatMembershipTypes(
    membershipTypes: ScheduledActivityResponse["membershipTypes"],
): string {
    if (!membershipTypes?.length) return "-";
    return membershipTypes.map((m) => m.name).join(", ");
}

function formatAssistants(
    assistants: ScheduledActivityResponse["assistantWorkers"],
): string {
    if (!assistants?.length) return "-";
    return assistants.map((w) => w.name).join(", ");
}

export interface DeleteScheduledActivitiesFormProps {
    scheduledActivity: ScheduledActivityResponse;
}

export default function DeleteScheduledActivitiesForm({
    scheduledActivity,
}: DeleteScheduledActivitiesFormProps) {
    const navigate = useNavigate();
    const clubIdFromStore = useClubIdStore((state) => state.clubId);
    const deleteScheduledActivity = useScheduledActivityStore(
        (state) => state.deleteScheduledActivity
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const clubId = scheduledActivity.clubId ?? clubIdFromStore;
        if (!clubId) {
            setError("No se pudo determinar el club de la actividad rutinaria.");
            return;
        }

        const query: ScheduledActivityQuery = {
            id: scheduledActivity.id,
            clubId,
        };

        setLoading(true);
        setError(null);

        try {
            await AxiosInstance.delete(
                `/scheduled-activities/${query.id}?clubId=${query.clubId}`
            );
            deleteScheduledActivity(query.id);
            navigate("/actividades-rutinarias");
        } catch (err: unknown) {
            console.error("[DeleteScheduledActivity] error", err);
            setError("No se pudo eliminar la actividad rutinaria. Intentá de nuevo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-2xl">
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                    ¿Estás seguro de que querés eliminar esta actividad rutinaria?
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="delete-sa-name" className="activityFormLabel">
                        Nombre
                    </label>
                    <input
                        id="delete-sa-name"
                        type="text"
                        readOnly
                        disabled
                        className="activityFormControl bg-slate-50"
                        value={scheduledActivity.name}
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="delete-sa-facility" className="activityFormLabel">
                        Instalación
                    </label>
                    <input
                        id="delete-sa-facility"
                        type="text"
                        readOnly
                        disabled
                        className="activityFormControl bg-slate-50"
                        value={scheduledActivity.facility?.type ?? "-"}
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="delete-sa-responsible" className="activityFormLabel">
                        Trabajador responsable
                    </label>
                    <input
                        id="delete-sa-responsible"
                        type="text"
                        readOnly
                        disabled
                        className="activityFormControl bg-slate-50"
                        value={scheduledActivity.user?.name ?? "-"}
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="delete-sa-memberships" className="activityFormLabel">
                        Tipos de membresía
                    </label>
                    <input
                        id="delete-sa-memberships"
                        type="text"
                        readOnly
                        disabled
                        className="activityFormControl bg-slate-50"
                        value={formatMembershipTypes(scheduledActivity.membershipTypes)}
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="delete-sa-schedules" className="activityFormLabel">
                        Horarios
                    </label>
                    <input
                        id="delete-sa-schedules"
                        type="text"
                        readOnly
                        disabled
                        className="activityFormControl bg-slate-50"
                        value={formatSchedules(scheduledActivity.datetimeScheduledActivities)}
                    />
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="delete-sa-assistants" className="activityFormLabel">
                        Trabajadores asistentes
                    </label>
                    <input
                        id="delete-sa-assistants"
                        type="text"
                        readOnly
                        disabled
                        className="activityFormControl bg-slate-50"
                        value={formatAssistants(scheduledActivity.assistantWorkers)}
                    />
                </div>

                {error && <p className="activityFormError">{error}</p>}

                <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                        type="submit"
                        className="activityDangerButton"
                        disabled={loading}
                    >
                        {loading ? "Eliminando..." : "Eliminar actividad rutinaria"}
                    </button>
                    <button
                        type="button"
                        className="activitySecondaryButton"
                        onClick={() => navigate("/actividades-rutinarias")}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
