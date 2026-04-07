import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../config/axios";
import type { ActivityResponse } from "../../entities/Entities";
import { useActivityStore, useFacilityStore, useUserStore } from "../../store/store";

export default function DeleteActivityForm({ activity }: { activity: ActivityResponse}) {
  const navigate = useNavigate();

  const user = useUserStore((s) => s.getUser(activity.user.id));
  const facility = useFacilityStore((s) => s.getFacility(activity.facility.id));
  const onSubmit = async (data: { id: number }) => {
    try {
      const response = await AxiosInstance.delete<ActivityResponse>(`/activities/${data.id}`);
      const deleted = response.data;
      if (deleted) {
        useActivityStore.getState().deleteActivity(deleted.id!);
        navigate("/actividades");
      }
    } catch (error: unknown) {
      console.error("[DeleteActivity] error", error);
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
          ¿Estás seguro de que querés eliminar esta actividad?
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
            Eliminar actividad
          </button>
          <button
            type="button"
            className="activitySecondaryButton"
            onClick={() => navigate("/actividades")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
