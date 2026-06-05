import { useEffect, useState } from "react";
import { useUserStore } from "../../store/store";

export interface SelectActivityMembersProps {
    open: boolean;
    onClose: () => void;
    selectedIds: number[];
    onConfirm: (ids: number[]) => void;
    excludeUserIds?: number[];
    title?: string;
}

export default function SelectActivityMembers({
    open,
    onClose,
    selectedIds,
    onConfirm,
    excludeUserIds = [],
    title = "Trabajadores asistentes",
}: SelectActivityMembersProps) {
    const users = useUserStore((state) => state.users);
    const workerUsers = users.filter(
        (u) => u.typeId === 1 && !excludeUserIds.includes(u.id)
    );
    const [draftIds, setDraftIds] = useState<number[]>(selectedIds);

    useEffect(() => {
        if (open) {
            setDraftIds(selectedIds);
        }
    }, [open, selectedIds]);

    const toggleUser = (userId: number) => {
        setDraftIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleConfirm = () => {
        onConfirm(draftIds);
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
            aria-labelledby="select-activity-members-title"
        >
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header bg-light">
                        <h5 className="modal-title" id="select-activity-members-title">
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
                        {workerUsers.length === 0 ? (
                            <p className="mb-0 text-sm text-slate-500">
                                No hay trabajadores disponibles para seleccionar.
                            </p>
                        ) : (
                            <ul className="list-unstyled mb-0 space-y-2">
                                {workerUsers.map((user) => {
                                    const checked = draftIds.includes(user.id);
                                    return (
                                        <li key={user.id}>
                                            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 px-3 py-2 hover:bg-slate-50">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-200"
                                                    checked={checked}
                                                    onChange={() => toggleUser(user.id)}
                                                />
                                                <span className="text-sm text-slate-900">
                                                    {user.name}
                                                </span>
                                            </label>
                                        </li>
                                    );
                                })}
                            </ul>
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
                        >
                            Confirmar
                            {draftIds.length > 0 ? ` (${draftIds.length})` : ""}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
