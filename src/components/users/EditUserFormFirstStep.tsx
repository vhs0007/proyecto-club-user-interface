import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { UserResponse } from "../../entities/Entities";
import { useEditUserStore, useUserTypeStore } from "../../store/store";
import type { UserType } from "../../entities/Entities";

const formSchema = z.object({
  name: z.string().min(1),
  typeId: z.number().min(1, "Seleccioná un tipo de usuario"),
  email: z.string().email(),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

export default function EditUserFormFirstStep({ user }: { user: UserResponse }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const userTypes: UserType[] = useUserTypeStore((state) => state.userTypes);

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
      typeId: user.type?.id ?? user.typeId ?? 0,
      email: user.email ?? "",
      isActive: user.isActive,
    },
  });

  useEffect(() => {
    reset({
      name: user.name ?? "",
      typeId: user.type?.id ?? user.typeId ?? 0,
      email: user.email ?? "",
      isActive: user.isActive,
    });
  }, [user, reset]);

  const onSubmit = (data: FormData) => {
    useEditUserStore.getState().setFirstStep({
      name: data.name,
      typeId: data.typeId,
      email: data.email,
      isActive: data.isActive,
    });
    if (!id) return;
    navigate(`/usuarios/editar/${id}/paso-2`);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" value={user.id} readOnly disabled />

      <div className="form-group mb-3">
        <label htmlFor="userId" className="form-label">
          ID
        </label>
        <input type="number" className="form-control" value={user.id} disabled readOnly />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="name" className="form-label">
          Nombre
        </label>
        <input type="text" className="form-control" {...register("name")} />
        {errors.name && <span className="text-danger">{errors.name.message}</span>}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="typeId" className="form-label">
          Tipo de usuario
        </label>
        <select className="form-select" {...register("typeId", { valueAsNumber: true })}>
          <option value={0}>Seleccione un tipo</option>
          {userTypes.map((ut) => (
            <option key={ut.id} value={ut.id}>
              {ut.name}
            </option>
          ))}
        </select>
        {errors.typeId && <span className="text-danger">{errors.typeId.message}</span>}
      </div>

      <div className="form-group mb-3">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input type="email" className="form-control" {...register("email")} />
        {errors.email && <span className="text-danger">{errors.email.message}</span>}
      </div>

      <div className="form-group mb-3 form-check">
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <>
              <input
                type="checkbox"
                className="form-check-input"
                id="isActive"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="isActive">
                Activo
              </label>
            </>
          )}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Siguiente
      </button>
    </form>
  );
}
