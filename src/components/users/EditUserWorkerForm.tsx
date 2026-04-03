import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import type { UserResponse } from "../../entities/Entities";
import { useEditUserStore, useUserStore } from "../../store/store";
import AxiosInstance from "../../config/axios";

function toDatetimeLocal(d: Date | string | null | undefined): string {
  if (d == null) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const workerSchema = z.object({
  salary: z.number().min(1, "El salario es requerido"),
  hoursToWorkPerDay: z.number().min(1, "Las horas por día son requeridas"),
  startWorkAt: z.string().min(1, "La fecha de inicio es requerida"),
  endWorkAt: z.string().min(1, "La fecha de fin es requerida"),
});

export default function EditUserWorkerForm({ user }: { user: UserResponse }) {
  const { id: idParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const firstStep = useEditUserStore((s) => s.firstStep);

  const form = useForm<z.infer<typeof workerSchema>>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      salary: user.salary ?? 0,
      hoursToWorkPerDay: user.hoursToWorkPerDay ?? 0,
      startWorkAt: toDatetimeLocal(user.startWorkAt),
      endWorkAt: toDatetimeLocal(user.endWorkAt),
    },
  });

  const onSubmit = async (data: z.infer<typeof workerSchema>) => {
    if (!user.id || !idParam) return;
    try {
      const payload = {
        name: firstStep.name,
        email: firstStep.email,
        typeId: firstStep.typeId,
        isActive: firstStep.isActive,
        salary: data.salary,
        hoursToWorkPerDay: data.hoursToWorkPerDay,
        startWorkAt: new Date(data.startWorkAt),
        endWorkAt: new Date(data.endWorkAt),
      };
      const response = await AxiosInstance.patch<UserResponse>(`/users/${user.id}`, payload);
      if (response?.data) {
        useUserStore.getState().updateUser(response.data);
        alert("Usuario actualizado correctamente");
        navigate("/trabajadores");
      }
    } catch (error) {
      alert("Error al actualizar el usuario");
      console.error(error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <input type="hidden" value={user.id} readOnly disabled />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Salario</label>
          <input
            type="number"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("salary", { valueAsNumber: true })}
          />
          {errors.salary && <span className="text-sm text-red-600">{errors.salary.message}</span>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Horas de trabajo por día</label>
          <input
            type="number"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("hoursToWorkPerDay", { valueAsNumber: true })}
          />
          {errors.hoursToWorkPerDay && (
            <span className="text-sm text-red-600">{errors.hoursToWorkPerDay.message}</span>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Inicio de trabajo</label>
          <input
            type="datetime-local"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("startWorkAt")}
          />
          {errors.startWorkAt && <span className="text-sm text-red-600">{errors.startWorkAt.message}</span>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Fin de trabajo</label>
          <input
            type="datetime-local"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("endWorkAt")}
          />
          {errors.endWorkAt && <span className="text-sm text-red-600">{errors.endWorkAt.message}</span>}
        </div>
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
