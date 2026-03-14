import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMembershipTypeStore } from "../../store/store";
import Axios from '../../config/axios';

const schema = z.object({
  type: z.number().min(1, "Seleccioná un tipo de membresía"),
  userId: z.number().min(1, "El usuario es requerido"),
});

export type CreateMembershipFormData = z.infer<typeof schema>;

export default function CreateMembershipForm() {
  const membershipTypes = useMembershipTypeStore((state) => state.membershipTypes);
  console.log("membership types en el form", membershipTypes);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMembershipFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 0,
      userId: 0,
    },
  });

  const onSubmit = async (data: CreateMembershipFormData) => {
    console.log(data);
    try {
      const response = await Axios.post('/membership', data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label className="form-label">Tipo de membresía</label>
        <select
          className={`form-select ${errors.type ? "is-invalid" : ""}`}
          {...register("type", { valueAsNumber: true })}
        >
          <option value={0}>Seleccionar...</option>
          {membershipTypes.map((mt) => (
            <option key={mt.id} value={mt.id}>
              {mt.name}
            </option>
          ))}
        </select>
        {errors.type && (
          <div className="invalid-feedback">{errors.type.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Usuario</label>
        <input
          type="number"
          placeholder="ID del usuario"
          className={`form-control ${errors.userId ? "is-invalid" : ""}`}
          {...register("userId", { valueAsNumber: true })}
        />
        {errors.userId && (
          <div className="invalid-feedback">{errors.userId.message}</div>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
  );
}
