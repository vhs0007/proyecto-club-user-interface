import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { MembershipResponse } from "../../entities/Entities";
import { useMembershipTypeStore, useMembershipStore } from "../../store/store";
import AxiosInstance from "../../config/axios";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  type: z.number().min(1, "Seleccioná un tipo de membresía"),
});

export type EditMembershipFormData = z.infer<typeof schema>;

export interface EditMembershipFormProps {
  membership: MembershipResponse | null;
}

export default function EditMembershipForm({ membership }: EditMembershipFormProps) {
  const membershipTypes = useMembershipTypeStore((state) => state.membershipTypes);
  const updateMembership = useMembershipStore((state) => state.updateMembership);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<EditMembershipFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 0,
    },
  });

  useEffect(() => {
    if (membership) {
      reset({
        type: membership.membershipType?.id ?? 0,
      });
    }
  }, [membership, reset]);

  const onSubmit = async (data: EditMembershipFormData) => {
    if (!membership?.id) return;
    console.log(data);
    const membershipToSend = {
      ...data,
    }
    const response = await AxiosInstance.patch(`/membership/${membership.id}`, membershipToSend);
    console.log(response);
    if (response.status === 200 && response.data) {
      updateMembership(response.data as MembershipResponse);
      navigate('/membresias');
    }else{
      alert('Error al actualizar la membresía');
    }
  };

  if (!membership) return null;

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
        {errors.type && <div className="invalid-feedback">{errors.type.message}</div>}
      </div>
      <button type="submit" className="btn btn-primary">Guardar</button>
    </form>
  );
}