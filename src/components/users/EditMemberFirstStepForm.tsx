import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { UserResponse } from "../../entities/Entities";
import { useEditUserStore, useUserStore } from "../../store/store";
import AxiosInstance from "../../config/axios";

const formSchema = z.object({
  name: z.string().min(1),
  typeId: z.number().min(1, "Seleccioná un tipo de usuario"),
  email: z.string().email(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditMemberFirstStepForm({ user }: { user: UserResponse }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name ?? "",
      typeId: 2,
      email: user.email ?? "",
      isActive: user.isActive,
    },
  });

  useEffect(() => {
    reset({
      name: user.name ?? "",
      typeId: 2,
      email: user.email ?? "",
      isActive: user.isActive,
    });
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    useEditUserStore.getState().setFirstStep({
      name: data.name,
      typeId: data.typeId,
      email: data.email,
      isActive: data.isActive,
    });
    if (!id) return;
    if(user.type?.id === 3){
      navigate(`/miembros/editar/${id}/paso-especifico-atleta`);
    }else{
      const response = await AxiosInstance.patch(`/users/${id}`, {
        name: data.name,
        email: data.email,
        isActive: data.isActive,
      });
      if(response.status === 200){
        useUserStore.getState().updateUser(response.data);
        navigate(`/miembros`);
      }
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <input type="hidden" value={user.id} readOnly disabled />

        <div className="space-y-1.5">
          <label htmlFor="userId" className="block text-sm font-medium text-slate-700">
            ID
          </label>
          <input
            id="userId"
            type="number"
            className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700"
            value={user.id}
            disabled
            readOnly
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-sm font-medium text-slate-700">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("name")}
          />
          {errors.name && <span className="text-sm text-red-600">{errors.name.message}</span>}
        </div>

        <input type="hidden" {...register("typeId", { valueAsNumber: true })} />

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("email")}
          />
          {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
        </div>

        <div className="flex items-center gap-2">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-300"
                  id="isActive"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <label className="text-sm font-medium text-slate-700" htmlFor="isActive">
                  Activo
                </label>
              </>
            )}
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Siguiente
        </button>
      </form>
    </div>
  );
}
