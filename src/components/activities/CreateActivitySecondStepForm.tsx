import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "../../config/axios";
import {
  useActivityStore,
  useCreateActivityStore,
  useFacilityStore,
  useUserStore,
} from "../../store/store";
import type { ActivityResponse } from "../../entities/Entities";

const schema = z.object({
  userId: z.number().min(1, "Usuario requerido"),
  cost: z.number().min(0, "El costo debe ser mayor o igual a 0"),
  facilityId: z.number().min(1, "Seleccioná una instalación"),
});

export type CreateActivityFormData = z.infer<typeof schema>;

const errBorder = (has: boolean) =>
  has ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "";

export default function CreateActivitySecondStepForm() {
  const navigate = useNavigate();
  const setActivity = useActivityStore((state) => state.setActivity);
  const users = useUserStore((state) => state.users);
  const facilities = useFacilityStore((state) => state.facilities);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateActivityFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: 0,
      cost: 0,
      facilityId: 0,
    },
  });

  const onSubmit = async (data: CreateActivityFormData) => {
    try {
      const firstStep = useCreateActivityStore.getState().firstStep;
      const userTypeId = users.find((u) => u.id === data.userId)?.typeId;
      const payload = {
        name: firstStep.name,
        type: firstStep.type,
        clubId: firstStep.clubId,
        date: new Date(firstStep.date).toISOString(),
        hourStart: firstStep.hourStart,
        hourEnd: firstStep.hourEnd,
        userId: data.userId,
        userTypeId,
        cost: data.cost,
        facilityId: data.facilityId,
        isActive: firstStep.isActive,
      };
      const response = await AxiosInstance.post<ActivityResponse>("/activities", payload);
      const created = response.data;
      if (created) setActivity(created);
      navigate("/reservas");
    } catch (error: unknown) {
      console.error("[CreateActivity] error", error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="space-y-1.5">
          <label htmlFor="create-step2-userId" className="activityFormLabel">
            Usuario
          </label>
          <select
            id="create-step2-userId"
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
          {errors.userId && (
            <div className="activityFormError">{errors.userId.message}</div>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="create-step2-cost" className="activityFormLabel">Costo</label>
          <input
            id="create-step2-cost"
            type="number"
            step="0.01"
            min={0}
            placeholder="0"
            className={`activityFormControl ${errBorder(!!errors.cost)}`}
            {...register("cost", { valueAsNumber: true })}
          />
          {errors.cost && (
            <div className="activityFormError">{errors.cost.message}</div>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="create-step2-facilityId" className="activityFormLabel">
            Instalación
          </label>
          <select
            id="create-step2-facilityId"
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
            <div className="activityFormError">{errors.facilityId.message}</div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button type="submit" className="activityPrimaryButton">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
