import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../config/axios";
import type { ActivityResponse } from "../../entities/Entities";
import { useActivityStore, useClubIdStore, useFacilityStore, useUserStore } from "../../store/store";

function getDeleteErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string | string[] } } }).response?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data.message;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    Array.isArray((error as { response?: { data?: { message?: string[] } } }).response?.data?.message)
  ) {
    return ((error as { response: { data: { message: string[] } } }).response.data.message).join(", ");
  }
  return "No se pudo eliminar la reserva. Verificá que no esté en estado COMPLETADO o SEÑADA.";
}

export default function DeleteActivityForm({ activity }: { activity: ActivityResponse}) {
  const navigate = useNavigate();
  const clubIdFromStore = useClubIdStore((state) => state.clubId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const user = useUserStore((s) => s.getUser(activity.user.id, activity.user.type.id));
  const facility = useFacilityStore((s) => s.getFacility(activity.facility.id));
  const onSubmit = async (data: { id: number }) => {
    const clubId = activity.clubId ?? clubIdFromStore;
    if (!clubId) return;
    setErrorMessage(null);
    try {
      const response = await AxiosInstance.delete<ActivityResponse>(`/activities/${data.id}?clubId=${clubId}`);
      const deleted = response.data;
      if (deleted) {
        useActivityStore.getState().deleteActivity(deleted.id!);
        navigate("/reservas");
      }
    } catch (error: unknown) {
      console.error("[DeleteActivity] error", error);
      setErrorMessage(getDeleteErrorMessage(error));
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ id: activity.id! ?? 0 });
        }}
        className="space-y-4"
      >
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          ¿Estás seguro de que querés eliminar esta reserva?
        </div>

        {errorMessage && (
          <div className="rounded-md border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {errorMessage}
          </div>
        )}

        <div>
          <label htmlFor="activityState" className="activityFormLabel">Estado</label>
          <input
            type="text"
            id="activityState"
            readOnly
            disabled
            aria-label="Estado de la reserva"
            className="activityFormControl bg-slate-50"
            value={activity.state}
          />
        </div>

        <div>
          <label htmlFor="facilityId" className="activityFormLabel">ID de instalación</label>
          <input
            type="text"
            id="facilityId"
            readOnly
            disabled
            aria-label="ID de instalación"
            className="activityFormControl bg-slate-50"
            value={facility?.type}
          />
        </div>

        <div>
          <label htmlFor="userId" className="activityFormLabel">ID de usuario</label>
          <input
            type="text"
            id="userId"
            readOnly
            disabled
            aria-label="ID de usuario"
            className="activityFormControl bg-slate-50"
            value={user?.name}
          />
        </div>

        <div>
          <label htmlFor="cost" className="activityFormLabel">Costo</label>
          <input
            type="text"
            id="cost"
            readOnly
            disabled
            aria-label="Costo"
            className="activityFormControl bg-slate-50"
            value={activity.cost}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button type="submit" className="activityDangerButton">
            Eliminar reserva
          </button>
          <button
            type="button"
            className="activitySecondaryButton"
            onClick={() => navigate("/reservas")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
