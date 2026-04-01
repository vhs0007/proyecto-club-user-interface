import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../config/axios";
import { useActivityStore } from "../../store/store";
import type { Activity, ActivityResponse } from "../../entities/Entities";

export default function DeleteActivityForm({ activity }: { activity: Activity}) {
  const navigate = useNavigate();

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
    <form onSubmit={(e) => {
      e.preventDefault();
      onSubmit({ id: activity.id! ?? 0 });
    }}>
      <div className="mb-3">
        <label htmlFor="facilityId" className="form-label">ID de instalación</label>
        <input
          type="number"
          id="facilityId"
          min={1}
          placeholder="ID de la instalación"
          disabled
          value={"instalación: "+ activity.facilityId}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="userId" className="form-label">ID de usuario</label>
        <input
          type="number"
          id="userId"
          min={1}
          placeholder="ID del usuario"
          disabled
          value={"usuario: "+ activity.userId}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="cost" className="form-label">Costo</label>
        <input
          type="number"
          id="cost"
          step="0.01"
          min={0}
          placeholder="0"
          disabled
          value={"costo actividad: $"+ activity.cost}
        />
      </div>

      <button type="submit" className="btn btn-danger">
        Eliminar actividad
      </button>
    </form>
  );
}