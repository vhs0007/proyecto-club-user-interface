import type { FormEvent } from "react";
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

function toDateInput(d: Date | string | null | undefined): string {
  if (d == null) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

function isAthleteProfile(user: UserResponse): boolean {
  const name = user.type?.name?.toLowerCase();
  if (name === "athlete") return true;
  if (user.weight != null && user.weight > 0) return true;
  if (user.height != null && user.height > 0) return true;
  if (user.birthDate != null) return true;
  return false;
}

const workerSchema = z.object({
  salary: z.number().min(1, "El salario es requerido"),
  hoursToWorkPerDay: z.number().min(1, "Las horas por día son requeridas"),
  startWorkAt: z.string().min(1, "La fecha de inicio es requerida"),
  endWorkAt: z.string().min(1, "La fecha de fin es requerida"),
});

const athleteSchema = z.object({
  weight: z.number().min(1, "El peso es requerido"),
  height: z.number().min(1, "La altura es requerida"),
  gender: z.string().min(1, "El género es requerido"),
  birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
  diet: z.string(),
  trainingPlan: z.string(),
  allergies: z.string(),
  medications: z.string(),
  medicalConditions: z.string(),
});

export default function EditUserFormSecondStep({ user }: { user: UserResponse }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const firstStep = useEditUserStore((s) => s.firstStep);

  const typeId = firstStep.typeId;
  const showWorker = typeId === 1;
  const showAthlete = typeId === 2 && isAthleteProfile(user);

  if (showWorker) {
    return <EditUserWorkerSecond user={user} idParam={id} navigate={navigate} firstStep={firstStep} />;
  }
  if (showAthlete) {
    return <EditUserAthleteSecond user={user} idParam={id} navigate={navigate} firstStep={firstStep} />;
  }
  return <EditUserMemberSecond user={user} idParam={id} navigate={navigate} firstStep={firstStep} />;
}

function EditUserMemberSecond({
  user,
  idParam,
  navigate,
  firstStep,
}: {
  user: UserResponse;
  idParam: string | undefined;
  navigate: ReturnType<typeof useNavigate>;
  firstStep: { name: string; typeId: number; email: string; isActive: boolean };
}) {
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user.id || !idParam) return;
    try {
      const payload = {
        name: firstStep.name,
        email: firstStep.email,
        typeId: firstStep.typeId,
        isActive: firstStep.isActive,
      };
      const response = await AxiosInstance.patch<UserResponse>(`/users/${user.id}`, payload);
      if (response?.data) {
        useUserStore.getState().updateUser(response.data);
        alert("Usuario actualizado correctamente");
        navigate("/usuarios");
      }
    } catch (error) {
      alert("Error al actualizar el usuario");
      console.error(error);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={onSubmit} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <input type="hidden" value={user.id} readOnly disabled />
        <p className="text-sm text-slate-700">Confirmá los datos generales del usuario.</p>
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

function EditUserWorkerSecond({
  user,
  idParam,
  navigate,
  firstStep,
}: {
  user: UserResponse;
  idParam: string | undefined;
  navigate: ReturnType<typeof useNavigate>;
  firstStep: { name: string; typeId: number; email: string; isActive: boolean };
}) {
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
        navigate("/usuarios");
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

function EditUserAthleteSecond({
  user,
  idParam,
  navigate,
  firstStep,
}: {
  user: UserResponse;
  idParam: string | undefined;
  navigate: ReturnType<typeof useNavigate>;
  firstStep: { name: string; typeId: number; email: string; isActive: boolean };
}) {
  const form = useForm<z.infer<typeof athleteSchema>>({
    resolver: zodResolver(athleteSchema),
    defaultValues: {
      weight: user.weight ?? 0,
      height: user.height ?? 0,
      gender: user.gender ?? "",
      birthDate: toDateInput(user.birthDate),
      diet: user.diet ?? "",
      trainingPlan: user.trainingPlan ?? "",
      allergies: user.allergies ?? "",
      medications: user.medications ?? "",
      medicalConditions: user.medicalConditions ?? "",
    },
  });

  const onSubmit = async (data: z.infer<typeof athleteSchema>) => {
    if (!user.id || !idParam) return;
    try {
      const payload = {
        name: firstStep.name,
        email: firstStep.email,
        typeId: firstStep.typeId,
        isActive: firstStep.isActive,
        weight: data.weight,
        height: data.height,
        gender: data.gender,
        birthDate: new Date(data.birthDate),
        diet: data.diet || null,
        trainingPlan: data.trainingPlan || null,
        allergies: data.allergies || null,
        medications: data.medications || null,
        medicalConditions: data.medicalConditions || null,
      };
      const response = await AxiosInstance.patch<UserResponse>(`/users/${user.id}`, payload);
      if (response?.data) {
        useUserStore.getState().updateUser(response.data);
        alert("Usuario actualizado correctamente");
        navigate("/usuarios");
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
          <label className="block text-sm font-medium text-slate-700">Peso (kg)</label>
          <input
            type="number"
            step="0.1"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("weight", { valueAsNumber: true })}
          />
          {errors.weight && <span className="text-sm text-red-600">{errors.weight.message}</span>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Altura (cm)</label>
          <input
            type="number"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("height", { valueAsNumber: true })}
          />
          {errors.height && <span className="text-sm text-red-600">{errors.height.message}</span>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Género</label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("gender")}
          />
          {errors.gender && <span className="text-sm text-red-600">{errors.gender.message}</span>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Fecha de nacimiento</label>
          <input
            type="date"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("birthDate")}
          />
          {errors.birthDate && <span className="text-sm text-red-600">{errors.birthDate.message}</span>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Dieta</label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("diet")}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Plan de entrenamiento</label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("trainingPlan")}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Alergias</label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("allergies")}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Medicación</label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("medications")}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Condiciones médicas</label>
          <input
            type="text"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("medicalConditions")}
          />
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
