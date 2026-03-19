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
    <form onSubmit={onSubmit}>
      <input type="hidden" value={user.id} readOnly disabled />
      <p className="mb-3">Confirmá los datos generales del usuario.</p>
      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" value={user.id} readOnly disabled />
      <div className="form-group mb-3">
        <label className="form-label">Salario</label>
        <input type="number" className="form-control" {...register("salary", { valueAsNumber: true })} />
        {errors.salary && <span className="text-danger">{errors.salary.message}</span>}
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Horas de trabajo por día</label>
        <input
          type="number"
          className="form-control"
          {...register("hoursToWorkPerDay", { valueAsNumber: true })}
        />
        {errors.hoursToWorkPerDay && (
          <span className="text-danger">{errors.hoursToWorkPerDay.message}</span>
        )}
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Inicio de trabajo</label>
        <input type="datetime-local" className="form-control" {...register("startWorkAt")} />
        {errors.startWorkAt && <span className="text-danger">{errors.startWorkAt.message}</span>}
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Fin de trabajo</label>
        <input type="datetime-local" className="form-control" {...register("endWorkAt")} />
        {errors.endWorkAt && <span className="text-danger">{errors.endWorkAt.message}</span>}
      </div>
      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" value={user.id} readOnly disabled />
      <div className="form-group mb-3">
        <label className="form-label">Peso (kg)</label>
        <input type="number" step="0.1" className="form-control" {...register("weight", { valueAsNumber: true })} />
        {errors.weight && <span className="text-danger">{errors.weight.message}</span>}
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Altura (cm)</label>
        <input type="number" className="form-control" {...register("height", { valueAsNumber: true })} />
        {errors.height && <span className="text-danger">{errors.height.message}</span>}
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Género</label>
        <input type="text" className="form-control" {...register("gender")} />
        {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Fecha de nacimiento</label>
        <input type="date" className="form-control" {...register("birthDate")} />
        {errors.birthDate && <span className="text-danger">{errors.birthDate.message}</span>}
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Dieta</label>
        <input type="text" className="form-control" {...register("diet")} />
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Plan de entrenamiento</label>
        <input type="text" className="form-control" {...register("trainingPlan")} />
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Alergias</label>
        <input type="text" className="form-control" {...register("allergies")} />
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Medicación</label>
        <input type="text" className="form-control" {...register("medications")} />
      </div>
      <div className="form-group mb-3">
        <label className="form-label">Condiciones médicas</label>
        <input type="text" className="form-control" {...register("medicalConditions")} />
      </div>
      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
  );
}
