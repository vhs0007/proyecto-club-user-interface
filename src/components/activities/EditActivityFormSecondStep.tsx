import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router-dom";
import AxiosInstance from "../../config/axios";
import {
  useActivityStore,
  useClubIdStore,
  useEditActivityStore,
  useFacilityStore,
  useUserStore,
} from "../../store/store";
import type { ActivityResponse } from "../../entities/Entities";

const schema = z.object({
  userId: z.number().min(1, "Usuario requerido"),
  cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  facilityId: z.number().min(1, "Seleccioná una instalación"),
});

type FormData = z.infer<typeof schema>;

const errBorder = (has: boolean) =>
  has ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "";

export default function EditActivityFormSecondStep({ activity }: { activity: ActivityResponse }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const clubIdFromStore = useClubIdStore((s) => s.clubId);
  const firstStep = useEditActivityStore((s) => s.firstStep);
  const editingActivityId = useEditActivityStore((s) => s.editingActivityId);
  const users = useUserStore((state) => state.users);
  const facilities = useFacilityStore((state) => state.facilities);
  const leavingAfterSuccessfulSave = useRef(false);

  useEffect(() => {
    if (!firstStep.name.trim()) {
      if (leavingAfterSuccessfulSave.current) {
        leavingAfterSuccessfulSave.current = false;
        return;
      }
      if (id) navigate(`/reservas/editar/${id}`, { replace: true });
      return;
    }
    if (editingActivityId !== null && editingActivityId !== activity.id) {
      useEditActivityStore.getState().resetEditActivity();
      navigate(`/reservas/editar/${activity.id}`, { replace: true });
    }
  }, [firstStep.name, editingActivityId, activity.id, id, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: activity.user?.id ?? 0,
      cost: activity.cost ?? 0,
      facilityId: activity.facility?.id ?? 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    const fs = useEditActivityStore.getState().firstStep;
    const userTypeId = users.find((u) => u.id === data.userId)?.typeId;
    try {
      const resolvedClubId = (fs.clubId || activity.clubId) ?? clubIdFromStore;
      if (!resolvedClubId) {
        alert("No se pudo determinar el club de la reserva");
        return;
      }
      const payload = {
        name: fs.name,
        type: fs.type,
        clubId: fs.clubId || activity.clubId,
        date: new Date(fs.date).toISOString(),
        hourStart: fs.hourStart,
        hourEnd: fs.hourEnd,
        userId: data.userId,
        userTypeId,
        cost: data.cost,
        facilityId: data.facilityId,
        isActive: fs.isActive ?? true,
      };
      const response = await AxiosInstance.patch<ActivityResponse>(
        `/activities/${id}?clubId=${resolvedClubId}`,
        payload,
      );
      if (response?.data) {
        useActivityStore.getState().updateActivity(response.data);
        leavingAfterSuccessfulSave.current = true;
        useEditActivityStore.getState().resetEditActivity();
        alert("Reserva actualizada correctamente");
        navigate("/reservas");
      }
    } catch (error) {
      alert("Error al actualizar la reserva");
      console.error(error);
    }
  };

  if (!firstStep.name.trim()) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div>
          <Link to={id ? `/reservas/editar/${id}` : "/reservas"} className="pageBackButton">
            Volver al paso 1
          </Link>
        </div>

        <p className="text-sm text-slate-700">
          Completá usuario, costo e instalación. Los datos generales se toman del paso anterior.
        </p>

        <div className="space-y-1.5">
          <label htmlFor="userId" className="activityFormLabel">
            Usuario
          </label>
          <select
            id="userId"
            className={`activityFormControl ${errBorder(!!errors.userId)}`}
            {...register("userId", { valueAsNumber: true })}
          >
            <option value={0}>Seleccioná un usuario</option>
            {users.filter((u) => u.typeId === 2).map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          {errors.userId && <span className="activityFormError">{errors.userId.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="cost" className="activityFormLabel">
            Costo
          </label>
          <input
            id="cost"
            type="number"
            step="0.01"
            min={0}
            placeholder="0"
            className={`activityFormControl ${errBorder(!!errors.cost)}`}
            {...register("cost", { valueAsNumber: true })}
          />
          {errors.cost && <span className="activityFormError">{errors.cost.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="facilityId" className="activityFormLabel">
            Instalación
          </label>
          <select
            id="facilityId"
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
          {errors.facilityId && <span className="activityFormError">{errors.facilityId.message}</span>}
        </div>

        <button type="submit" className="activityPrimaryButton">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
