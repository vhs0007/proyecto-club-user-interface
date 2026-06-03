import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    useClubIdStore,
    useCreateScheduledActivityStore,
    useMembershipTypeStore,
    useScheduledActivityStore,
    useUserStore,
    type CreateScheduledActivityThirdStep,
} from "../../store/store";
import type {
    DatetimeScheduledActivityRequest,
    MembershipType,
    ScheduledActivityRequest,
    ScheduledActivityResponse,
} from "../../entities/Entities";
import AxiosInstance from "../../config/axios";
import { useNavigate } from "react-router-dom";
import SelectActivityMembers from "./SelectActivityMembers";
import SelectDayActivity, { formatSchedulesSummary } from "./SelectDayActivity";

const schema = z.object({
    membershipTypeId: z.number().min(1, "Tipo de membresía requerido"),
});

export type CreateScheduledActivityFormThirdStep = z.infer<typeof schema>;

const errBorder = (has: boolean) =>
    has ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "";

const initialSchedules = (
    stored: DatetimeScheduledActivityRequest[],
    hourStart: string,
    hourEnd: string
): DatetimeScheduledActivityRequest[] => {
    if (stored.length > 0) {
        return stored;
    }
    if (hourStart || hourEnd) {
        return [{ workingDayId: 0, hourStart, hourEnd }];
    }
    return [];
};

export default function CreateScheduledActivityFormThirdStep() {
    const membershipTypes: MembershipType[] = useMembershipTypeStore(
        (state) => state.membershipTypes
    );
    const users = useUserStore((state) => state.users);
    const firstStep = useCreateScheduledActivityStore((state) => state.firstStep);
    const thirdStepStore = useCreateScheduledActivityStore((state) => state.thirdStep);
    const secondStep = useCreateScheduledActivityStore((state) => state.secondStep);

    const [assistantWorkerIds, setAssistantWorkerIds] = useState<number[]>(
        thirdStepStore.assistantWorkerIds
    );
    const [datetimeScheduledActivities, setDatetimeScheduledActivities] =
        useState<DatetimeScheduledActivityRequest[]>(() =>
            initialSchedules(
                thirdStepStore.datetimeScheduledActivities,
                firstStep.hourStart,
                firstStep.hourEnd
            )
        );
    const [membersModalOpen, setMembersModalOpen] = useState(false);
    const [daysModalOpen, setDaysModalOpen] = useState(false);
    const [schedulesError, setSchedulesError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateScheduledActivityFormThirdStep>({
        resolver: zodResolver(schema),
        defaultValues: {
            membershipTypeId: thirdStepStore.membershipTypesIds[0] ?? 0,
        },
    });

    const navigate = useNavigate();
    const setScheduledActivity = useScheduledActivityStore(
        (state) => state.setScheduledActivity
    );

    const selectedAssistantNames = users
        .filter((u) => u.typeId === 1 && assistantWorkerIds.includes(u.id))
        .map((u) => u.name)
        .join(", ");

    const schedulesSummary = formatSchedulesSummary(
        datetimeScheduledActivities.filter((s) => s.workingDayId > 0)
    );

    const onSubmit = async (data: CreateScheduledActivityFormThirdStep) => {
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

        setSchedulesError(null);
        const membershipTypesIds = [data.membershipTypeId];

        const thirdStep: CreateScheduledActivityThirdStep = {
            membershipTypesIds,
            datetimeScheduledActivities: validSchedules,
            assistantWorkerIds,
        };

        useCreateScheduledActivityStore.getState().setThirdStep(thirdStep);

        const request: ScheduledActivityRequest = {
            clubId: useClubIdStore.getState().clubId,
            facilityId: secondStep.facilityId,
            userId: secondStep.userId,
            userTypeId: 1,
            membershipTypesIds,
            datetimeScheduledActivities: validSchedules,
            assistantWorkerIds,
            name: firstStep.name,
        };

        try {
            const response = await AxiosInstance.post<ScheduledActivityResponse>(
                "/scheduled-activities",
                request
            );
            const created = response.data;
            if (created) setScheduledActivity(created);
            useCreateScheduledActivityStore.getState().resetCreateScheduledActivity();
            navigate("/actividades-rutinarias");
        } catch (error: unknown) {
            console.error("[CreateScheduledActivity] error", error);
        }
    };

    return (
        <div className="mx-auto w-full max-w-2xl">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
            >
                <div className="space-y-1.5">
                    <label htmlFor="membershipTypeId" className="activityFormLabel">
                        Tipo de membresía
                    </label>
                    <select
                        id="membershipTypeId"
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

                <SelectDayActivity
                    open={daysModalOpen}
                    onClose={() => setDaysModalOpen(false)}
                    schedules={datetimeScheduledActivities}
                    onConfirm={(schedules) => {
                        setDatetimeScheduledActivities(schedules);
                        setSchedulesError(null);
                    }}
                    defaultHourStart={firstStep.hourStart}
                    defaultHourEnd={firstStep.hourEnd}
                />

                <SelectActivityMembers
                    open={membersModalOpen}
                    onClose={() => setMembersModalOpen(false)}
                    selectedIds={assistantWorkerIds}
                    onConfirm={setAssistantWorkerIds}
                    excludeUserIds={
                        secondStep.userId > 0 ? [secondStep.userId] : []
                    }
                />

                <div className="flex items-center gap-2 pt-2">
                    <button type="submit" className="activityPrimaryButton">
                        Crear
                    </button>
                </div>
            </form>
        </div>
    );
}
