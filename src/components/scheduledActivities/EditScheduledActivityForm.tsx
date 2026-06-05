import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../config/axios";
import type {
    DatetimeScheduledActivityRequest,
    MembershipType,
    ScheduledActivityQuery,
    ScheduledActivityResponse,
    UpdateScheduledActivityRequest,
} from "../../entities/Entities";
import {
    useClubIdStore,
    useFacilityStore,
    useMembershipTypeStore,
    useScheduledActivityStore,
    useUserStore,
} from "../../store/store";
import SelectActivityMembers from "./SelectActivityMembers";
import SelectDayActivity, { formatSchedulesSummary } from "./SelectDayActivity";

const schema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    userId: z.number().min(1, "Trabajador responsable requerido"),
    facilityId: z.number().min(1, "Seleccioná una instalación"),
    membershipTypeId: z.number().min(1, "Tipo de membresía requerido"),
});

type FormData = z.infer<typeof schema>;

const errBorder = (has: boolean) =>
    has ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "";

function schedulesFromActivity(
    activity: ScheduledActivityResponse
): DatetimeScheduledActivityRequest[] {
    return (activity.datetimeScheduledActivities ?? []).map((d) => ({
        hourStart: d.hourStart,
        hourEnd: d.hourEnd,
        workingDayId: d.workingDay.id,
    }));
}

export interface EditScheduledActivityFormProps {
    scheduledActivity: ScheduledActivityResponse;
}

export default function EditScheduledActivityForm({
    scheduledActivity,
}: EditScheduledActivityFormProps) {
    const navigate = useNavigate();
    const clubIdFromStore = useClubIdStore((state) => state.clubId);
    const updateScheduledActivity = useScheduledActivityStore(
        (state) => state.updateScheduledActivity
    );
    const membershipTypes: MembershipType[] = useMembershipTypeStore(
        (state) => state.membershipTypes
    );
    const users = useUserStore((state) => state.users);
    const facilities = useFacilityStore((state) => state.facilities);
    const workerUsers = users.filter((u) => u.typeId === 1);

    const [assistantWorkerIds, setAssistantWorkerIds] = useState<number[]>(
        () => scheduledActivity.assistantWorkers?.map((w) => w.id) ?? []
    );
    const [datetimeScheduledActivities, setDatetimeScheduledActivities] =
        useState<DatetimeScheduledActivityRequest[]>(() =>
            schedulesFromActivity(scheduledActivity)
        );
    const [membersModalOpen, setMembersModalOpen] = useState(false);
    const [daysModalOpen, setDaysModalOpen] = useState(false);
    const [schedulesError, setSchedulesError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: scheduledActivity.name ?? "",
            userId: scheduledActivity.userId ?? scheduledActivity.user?.id ?? 0,
            facilityId:
                scheduledActivity.facility?.id ?? 0,
            membershipTypeId:
                scheduledActivity.membershipTypes?.[0]?.id ?? 0,
        },
    });

    const responsibleUserId =
        scheduledActivity.userId ?? scheduledActivity.user?.id ?? 0;

    const selectedAssistantNames = users
        .filter((u) => u.typeId === 1 && assistantWorkerIds.includes(u.id))
        .map((u) => u.name)
        .join(", ");

    const schedulesSummary = formatSchedulesSummary(
        datetimeScheduledActivities.filter((s) => s.workingDayId > 0)
    );

    const onSubmit = async (data: FormData) => {
        const validSchedules = datetimeScheduledActivities.filter(
            (s) =>
                s.workingDayId > 0 &&
                s.hourStart.trim() &&
                s.hourEnd.trim()
        );

        if (validSchedules.length === 0) {
            setSchedulesError(
                "Agregá al menos un día y horario desde el botón de horarios."
            );
            return;
        }

        const clubId = scheduledActivity.clubId ?? clubIdFromStore;
        if (!clubId) {
            setError("No se pudo determinar el club.");
            return;
        }

        const query: ScheduledActivityQuery = {
            id: scheduledActivity.id,
            clubId,
        };

        const payload: UpdateScheduledActivityRequest = {
            name: data.name,
            facilityId: data.facilityId,
            userId: data.userId,
            userTypeId: 1,
            membershipTypesIds: [data.membershipTypeId],
            datetimeScheduledActivities: validSchedules,
            assistantWorkerIds,
        };

        setLoading(true);
        setError(null);
        setSchedulesError(null);

        try {
            const response = await AxiosInstance.patch<ScheduledActivityResponse>(
                `/scheduled-activities/${query.id}?clubId=${query.clubId}`,
                payload
            );
            if (response.data) {
                updateScheduledActivity(response.data);
            }
            navigate("/actividades-rutinarias");
        } catch (err: unknown) {
            console.error("[EditScheduledActivity] error", err);
            setError("No se pudo actualizar la actividad rutinaria.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-2xl">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="space-y-1.5">
                    <label htmlFor="edit-sa-name" className="activityFormLabel">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="edit-sa-name"
                        className={`activityFormControl ${errBorder(!!errors.name)}`}
                        placeholder="Nombre de la actividad"
                        {...register("name")}
                    />
                    {errors.name && (
                        <div className="activityFormError">{errors.name.message}</div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="edit-sa-userId" className="activityFormLabel">
                        Trabajador responsable
                    </label>
                    <select
                        id="edit-sa-userId"
                        className={`activityFormControl ${errBorder(!!errors.userId)}`}
                        {...register("userId", { valueAsNumber: true })}
                    >
                        <option value={0}>Seleccioná un trabajador responsable</option>
                        {workerUsers.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                    {errors.userId && (
                        <div className="activityFormError">{errors.userId.message}</div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="edit-sa-facilityId" className="activityFormLabel">
                        Instalación
                    </label>
                    <select
                        id="edit-sa-facilityId"
                        className={`activityFormControl ${errBorder(!!errors.facilityId)}`}
                        {...register("facilityId", { valueAsNumber: true })}
                    >
                        <option value={0}>Seleccioná una instalación</option>
                        {facilities.map((f) => (
                            <option key={f.id} value={f.id}>
                                {f.type}
                            </option>
                        ))}
                    </select>
                    {errors.facilityId && (
                        <div className="activityFormError">
                            {errors.facilityId.message}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label htmlFor="edit-sa-membershipTypeId" className="activityFormLabel">
                        Tipo de membresía
                    </label>
                    <select
                        id="edit-sa-membershipTypeId"
                        className={`activityFormControl ${errBorder(!!errors.membershipTypeId)}`}
                        {...register("membershipTypeId", { valueAsNumber: true })}
                    >
                        <option value={0}>Seleccioná un tipo de membresía</option>
                        {membershipTypes.map((mt) => (
                            <option key={mt.id} value={mt.id}>
                                {mt.name}
                            </option>
                        ))}
                    </select>
                    {errors.membershipTypeId && (
                        <div className="activityFormError">
                            {errors.membershipTypeId.message}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <span className="activityFormLabel">Días y horarios</span>
                    <button
                        type="button"
                        className={`activityFormControl w-full text-left ${errBorder(!!schedulesError)}`}
                        onClick={() => {
                            setDaysModalOpen(true);
                            setSchedulesError(null);
                        }}
                    >
                        {datetimeScheduledActivities.filter((s) => s.workingDayId > 0)
                            .length > 0
                            ? `${datetimeScheduledActivities.filter((s) => s.workingDayId > 0).length} horario(s) configurado(s)`
                            : "Configurar días y horarios"}
                    </button>
                    {schedulesSummary && (
                        <p className="text-sm text-slate-600">{schedulesSummary}</p>
                    )}
                    {schedulesError && (
                        <div className="activityFormError">{schedulesError}</div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <span className="activityFormLabel">
                        Trabajadores asistentes (opcional)
                    </span>
                    <button
                        type="button"
                        className="activityFormControl w-full text-left"
                        onClick={() => setMembersModalOpen(true)}
                    >
                        {assistantWorkerIds.length > 0
                            ? `${assistantWorkerIds.length} seleccionado(s)`
                            : "Seleccionar asistentes"}
                    </button>
                    {selectedAssistantNames && (
                        <p className="text-sm text-slate-600">
                            {selectedAssistantNames}
                        </p>
                    )}
                </div>

                {error && <p className="activityFormError">{error}</p>}

                <SelectDayActivity
                    open={daysModalOpen}
                    onClose={() => setDaysModalOpen(false)}
                    schedules={datetimeScheduledActivities}
                    onConfirm={(schedules) => {
                        setDatetimeScheduledActivities(schedules);
                        setSchedulesError(null);
                    }}
                />

                <SelectActivityMembers
                    open={membersModalOpen}
                    onClose={() => setMembersModalOpen(false)}
                    selectedIds={assistantWorkerIds}
                    onConfirm={setAssistantWorkerIds}
                    excludeUserIds={
                        responsibleUserId > 0 ? [responsibleUserId] : []
                    }
                />

                <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                        type="submit"
                        className="activityPrimaryButton"
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar cambios"}
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
