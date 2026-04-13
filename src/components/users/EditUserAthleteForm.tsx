import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { UserResponse } from "../../entities/Entities";
import { useClubIdStore, useEditUserStore, useUserStore } from "../../store/store";
import AxiosInstance from "../../config/axios";

function toDateInput(d: Date | string | null | undefined): string {
  if (d == null) return "";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}


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

type FirstStep = { name: string; typeId: number; email: string; isActive: boolean };

export default function EditUserAthleteForm({ user }: { user: UserResponse }) {
  const { id: idParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const firstStep = useEditUserStore((s) => s.firstStep);
  const listPath = location.pathname.includes("/miembros") ? "/miembros" : "/trabajadores";
    return (
      <EditAthleteFields
        user={user}
        idParam={idParam}
        firstStep={firstStep}
        listPath={listPath}
        navigate={navigate}
      />
    );
  }


function EditAthleteFields({
  user,
  idParam,
  firstStep,
  listPath,
  navigate,
}: {
  user: UserResponse;
  idParam: string | undefined;
  firstStep: FirstStep;
  listPath: string;
  navigate: ReturnType<typeof useNavigate>;
}) {
  const clubId = useClubIdStore((state) => state.clubId);
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
        clubId,
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
        navigate(listPath);
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
