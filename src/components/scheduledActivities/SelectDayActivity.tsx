import { useEffect, useState } from "react";
import type { DatetimeScheduledActivityRequest, WorkingDay } from "../../entities/Entities";
import { useWorkingDayStore } from "../../store/store";

export function getWorkingDayLabel(
    workingDayId: number,
    workingDays?: WorkingDay[],
): string {
    const days = workingDays ?? useWorkingDayStore.getState().workingDays;
    return days.find((d) => d.id === workingDayId)?.dayOfWeek ?? "-";
}

export function formatSchedulesSummary(
    schedules: DatetimeScheduledActivityRequest[],
    workingDays?: WorkingDay[],
): string {
    if (!schedules.length) return "";
    return schedules
        .map(
            (s) =>
                `${getWorkingDayLabel(s.workingDayId, workingDays)} ${s.hourStart} - ${s.hourEnd}`
        )
        .join(", ");
}

const toMinutes = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    return hours * 60 + minutes;
};

const createEmptyRow = (
    hourStart = "",
    hourEnd = ""
): DatetimeScheduledActivityRequest => ({
    workingDayId: 0,
    hourStart,
    hourEnd,
});

const validateSchedules = (
    schedules: DatetimeScheduledActivityRequest[]
): string | null => {
    if (schedules.length === 0) {
        return "Agregá al menos un horario.";
    }

    for (let i = 0; i < schedules.length; i++) {
        const row = schedules[i];
        const n = i + 1;

        if (row.workingDayId < 1) {
            return `Horario ${n}: seleccioná un día.`;
        }
        if (!row.hourStart.trim()) {
            return `Horario ${n}: la hora de inicio es obligatoria.`;
        }
        if (!row.hourEnd.trim()) {
            return `Horario ${n}: la hora de fin es obligatoria.`;
        }
        if (toMinutes(row.hourEnd) <= toMinutes(row.hourStart)) {
            return `Horario ${n}: la hora de fin debe ser posterior al inicio.`;
        }
    }

    return null;
};

export interface SelectDayActivityProps {
    open: boolean;
    onClose: () => void;
    schedules: DatetimeScheduledActivityRequest[];
    onConfirm: (schedules: DatetimeScheduledActivityRequest[]) => void;
    defaultHourStart?: string;
    defaultHourEnd?: string;
    title?: string;
}

const errBorder = (has: boolean) =>
    has ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "";

export default function SelectDayActivity({
    open,
    onClose,
    schedules,
    onConfirm,
    defaultHourStart = "",
    defaultHourEnd = "",
    title = "Días y horarios",
}: SelectDayActivityProps) {
    const workingDays = useWorkingDayStore((state) => state.workingDays);
    const [draft, setDraft] = useState<DatetimeScheduledActivityRequest[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [rowErrors, setRowErrors] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (open) {
            setError(null);
            setRowErrors({});
            if (schedules.length > 0) {
                setDraft(schedules.map((s) => ({ ...s })));
            } else {
                setDraft([
                    createEmptyRow(defaultHourStart, defaultHourEnd),
                ]);
            }
        }
    }, [open, schedules, defaultHourStart, defaultHourEnd]);

    const updateRow = (
        index: number,
        field: keyof DatetimeScheduledActivityRequest,
        value: string | number
    ) => {
        setDraft((prev) =>
            prev.map((row, i) =>
                i === index ? { ...row, [field]: value } : row
            )
        );
        setRowErrors((prev) => {
            const next = { ...prev };
            delete next[index];
            return next;
        });
        setError(null);
    };

    const addRow = () => {
        setDraft((prev) => [
            ...prev,
            createEmptyRow(defaultHourStart, defaultHourEnd),
        ]);
    };

    const removeRow = (index: number) => {
        setDraft((prev) => prev.filter((_, i) => i !== index));
        setRowErrors({});
        setError(null);
    };

    const handleConfirm = () => {
        const validationError = validateSchedules(draft);
        if (validationError) {
            setError(validationError);
            const errors: Record<number, boolean> = {};
            draft.forEach((row, index) => {
                const invalid =
                    row.workingDayId < 1 ||
                    !row.hourStart.trim() ||
                    !row.hourEnd.trim() ||
                    toMinutes(row.hourEnd) <= toMinutes(row.hourStart);
                if (invalid) errors[index] = true;
            });
            setRowErrors(errors);
            return;
        }

        onConfirm(
            draft.map(({ workingDayId, hourStart, hourEnd }) => ({
                workingDayId,
                hourStart,
                hourEnd,
            }))
        );
        onClose();
    };

    if (!open) {
        return null;
    }

    return (
        <div
            className="modal fade show d-block modal-backdrop-custom"
            role="dialog"
            aria-modal="true"
            aria-labelledby="select-day-activity-title"
        >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div className="modal-content">
                    <div className="modal-header bg-light">
                        <h5
                            className="modal-title"
                            id="select-day-activity-title"
                        >
                            {title}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Cerrar"
                        />
                    </div>
                    <div className="modal-body">
                        <div className="mb-3 flex items-center justify-between gap-2">
                            <span className="text-sm text-slate-600">
                                Agregá uno o más días con su horario.
                            </span>
                            <button
                                type="button"
                                className="text-sm font-medium text-slate-700 underline hover:text-slate-900"
                                onClick={addRow}
                                disabled={workingDays.length === 0}
                            >
                                + Agregar horario
                            </button>
                        </div>

                        {workingDays.length === 0 ? (
                            <p className="text-sm text-slate-500">
                                No hay días laborales cargados. Sincronizá los datos del club.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {draft.map((row, index) => (
                                    <div
                                        key={index}
                                        className={`rounded-md border p-3 ${
                                            rowErrors[index]
                                                ? "border-red-300 bg-red-50/50"
                                                : "border-slate-200 bg-slate-50/50"
                                        }`}
                                    >
                                        <div className="mb-2 flex items-center justify-between gap-2">
                                            <span className="text-sm font-medium text-slate-700">
                                                Horario {index + 1}
                                            </span>
                                            {draft.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                    onClick={() => removeRow(index)}
                                                >
                                                    Quitar
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-3">
                                            <div className="space-y-1.5">
                                                <label
                                                    htmlFor={`day-${index}`}
                                                    className="activityFormLabel"
                                                >
                                                    Día
                                                </label>
                                                <select
                                                    id={`day-${index}`}
                                                    className={`activityFormControl ${errBorder(
                                                        rowErrors[index] &&
                                                            row.workingDayId < 1
                                                    )}`}
                                                    value={row.workingDayId}
                                                    onChange={(e) =>
                                                        updateRow(
                                                            index,
                                                            "workingDayId",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                >
                                                    <option value={0}>
                                                        Seleccioná un día
                                                    </option>
                                                    {workingDays.map((day) => (
                                                        <option
                                                            key={day.id}
                                                            value={day.id}
                                                        >
                                                            {day.dayOfWeek}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label
                                                    htmlFor={`hourStart-${index}`}
                                                    className="activityFormLabel"
                                                >
                                                    Hora de inicio
                                                </label>
                                                <input
                                                    type="time"
                                                    id={`hourStart-${index}`}
                                                    className={`activityFormControl ${errBorder(
                                                        !!rowErrors[index]
                                                    )}`}
                                                    value={row.hourStart}
                                                    onChange={(e) =>
                                                        updateRow(
                                                            index,
                                                            "hourStart",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label
                                                    htmlFor={`hourEnd-${index}`}
                                                    className="activityFormLabel"
                                                >
                                                    Hora de fin
                                                </label>
                                                <input
                                                    type="time"
                                                    id={`hourEnd-${index}`}
                                                    className={`activityFormControl ${errBorder(
                                                        !!rowErrors[index]
                                                    )}`}
                                                    value={row.hourEnd}
                                                    onChange={(e) =>
                                                        updateRow(
                                                            index,
                                                            "hourEnd",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {error && (
                            <p className="activityFormError mt-3">{error}</p>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="activityPrimaryButton"
                            onClick={handleConfirm}
                            disabled={workingDays.length === 0}
                        >
                            Confirmar
                            {draft.length > 0 ? ` (${draft.length})` : ""}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
