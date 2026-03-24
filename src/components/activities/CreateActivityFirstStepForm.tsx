import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useClubIdStore, useCreateActivityStore } from "../../store/store";

const formSchema = z
  .object({
    name: z.string().min(1, "El nombre es requerido"),
    type: z.string().min(1, "El tipo es requerido"),
    startAt: z.string().min(1, "Fecha y hora de inicio requerida"),
    endAt: z.string().min(1, "Fecha y hora de fin requerida"),
    isActive: z.boolean(),
  })
  .refine((data) => new Date(data.endAt).getTime() > new Date(data.startAt).getTime(), {
    message: "La fecha de fin debe ser posterior al inicio",
    path: ["endAt"],
  });

export type CreateActivityFirstStepFormData = z.infer<typeof formSchema>;

export default function CreateActivityFirstStepForm() {
  const navigate = useNavigate();
  const firstStep = useCreateActivityStore((s) => s.firstStep);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateActivityFirstStepFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: firstStep.name,
      type: firstStep.type,
      startAt: firstStep.startAt,
      endAt: firstStep.endAt,
      isActive: firstStep.isActive,
    },
  });

  const onSubmit = (data: CreateActivityFirstStepFormData) => {
    useCreateActivityStore.getState().setFirstStep({
      name: data.name,
      type: data.type,
      startAt: data.startAt,
      endAt: data.endAt,
      isActive: data.isActive,
      clubId: useClubIdStore.getState().clubId,
    });
    navigate("/actividades/crear/paso-2");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nombre</label>
        <input
          type="text"
          id="name"
          className={`form-control ${errors.name ? "is-invalid" : ""}`}
          placeholder="Ej: Clase de natación"
          {...register("name")}
        />
        {errors.name && <div className="invalid-feedback d-block">{errors.name.message}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="type" className="form-label">Tipo</label>
        <input
          type="text"
          id="type"
          className={`form-control ${errors.type ? "is-invalid" : ""}`}
          placeholder="Ej: Deportiva, recreativa"
          {...register("type")}
        />
        {errors.type && <div className="invalid-feedback d-block">{errors.type.message}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="startAt" className="form-label">Fecha y hora de inicio</label>
        <input
          type="datetime-local"
          id="startAt"
          className={`form-control ${errors.startAt ? "is-invalid" : ""}`}
          {...register("startAt")}
        />
        {errors.startAt && <div className="invalid-feedback d-block">{errors.startAt.message}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="endAt" className="form-label">Fecha y hora de fin</label>
        <input
          type="datetime-local"
          id="endAt"
          className={`form-control ${errors.endAt ? "is-invalid" : ""}`}
          {...register("endAt")}
        />
        {errors.endAt && <div className="invalid-feedback d-block">{errors.endAt.message}</div>}
      </div>
      <div className="mb-3 form-check">
        <input type="checkbox" className="form-check-input" id="isActive" {...register("isActive")} />
        <label className="form-check-label" htmlFor="isActive">
          Activa
        </label>
      </div>
      <button type="submit" className="btn btn-primary">
        Siguiente
      </button>
    </form>
  );
}
