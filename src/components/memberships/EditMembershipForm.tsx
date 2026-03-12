import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { Membership } from "../../entities/Entities";
import { useMembershipTypeStore, useMembershipStore } from "../../store/store";
import AxiosInstance from "../../config/axios";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  id: z.number().min(1, "El ID es requerido"),
  type: z.number().min(1, "Seleccioná un tipo de membresía"),
  price: z.number().min(1, "El precio debe ser mayor a 0"),
  facilitiesIncluded: z.string().min(1, "Las facilidades son requeridas"),
});

export type EditMembershipFormData = z.infer<typeof schema>;

export interface EditMembershipFormProps {
  membership: Membership | null;
}

export default function EditMembershipForm({ membership }: EditMembershipFormProps) {
  const membershipTypes = useMembershipTypeStore((state) => state.membershipTypes);
  const updateMembership = useMembershipStore((state) => state.updateMembership);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditMembershipFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: membership?.id,
      type: 0,
      price: 0,
      facilitiesIncluded: "",
    },
  });

  useEffect(() => {
    if (membership) {
      reset({
        id: membership?.id ?? 0,
        type: membership.type,
        price: membership.price,
        facilitiesIncluded: membership.facilitiesIncluded ?? "",
      });
    }
  }, [membership, reset]);

  const onSubmit = async (data: EditMembershipFormData) => {
    if (!membership?.id) return;
    console.log(data);
    const response = await AxiosInstance.patch(`/membership/${membership.id}`, data);
    console.log(response);
    if (response.status === 200) {
      updateMembership({ ...membership, ...data });
      navigate('/membresias');
    }
  };

  if (!membership) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <input type="hidden" {...register("id")} value={membership.id} />
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
        {errors.type && <div className="invalid-feedback">{errors.type.message}</div>}
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
        {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">Facilidades incluidas</label>
        <input
          type="text"
          placeholder="Facilidades incluidas en la membresía"
          className={`form-control ${errors.facilitiesIncluded ? "is-invalid" : ""}`}
          {...register("facilitiesIncluded")}
        />
        {errors.facilitiesIncluded && <div className="invalid-feedback">{errors.facilitiesIncluded.message}</div>}
      </div>
      <button type="submit" className="btn btn-primary">Guardar</button>
    </form>
  );
}