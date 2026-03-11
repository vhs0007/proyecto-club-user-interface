import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMembershipTypeStore } from "../../store/store";
import Axios from '../../config/axios';

const schema = z.object({
  type: z.number().min(1, "Seleccioná un tipo de membresía"),
  price: z.number().min(1, "El precio debe ser mayor a 0"),
  facilitiesIncluded: z.string().min(1, "Las facilidades son requeridas"),
});

export type CreateMembershipFormData = z.infer<typeof schema>;

export default function CreateMembershipForm() {
  const membershipTypes = useMembershipTypeStore((state) => state.membershipTypes);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMembershipFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 0,
      price: 0,
      facilitiesIncluded: "",
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
        <label className="form-label">Precio</label>
        <input
          type="number"
          step="0.01"
          min={0}
          placeholder="Precio"
          className={`form-control ${errors.price ? "is-invalid" : ""}`}
          {...register("price", { valueAsNumber: true })}
        />
        {errors.price && (
          <div className="invalid-feedback">{errors.price.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Facilidades incluidas</label>
        <input
          type="text"
          placeholder="Facilidades incluidas en la membresía"
          className={`form-control ${errors.facilitiesIncluded ? "is-invalid" : ""}`}
          {...register("facilitiesIncluded")}
        />
        {errors.facilitiesIncluded && (
          <div className="invalid-feedback">{errors.facilitiesIncluded.message}</div>
        )}
      </div>

      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
  );
}
