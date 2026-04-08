import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { MembershipResponse } from "../../entities/Entities";
import { useClubIdStore, useMembershipTypeStore, useMembershipStore } from "../../store/store";
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
  const clubIdFromStore = useClubIdStore((state) => state.clubId);
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
    const clubId = membership.clubId ?? clubIdFromStore;
    if (!clubId) return;
    console.log(data);
    const membershipToSend = {
      ...data,
    }
    const response = await AxiosInstance.patch(`/membership/${membership.id}?clubId=${clubId}`, membershipToSend);
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
    <div className="mx-auto w-full max-w-2xl">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="activityFormLabel">Tipo de membresía</label>
        <select
          className={`activityFormControl ${errors.type ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
          {...register("type", { valueAsNumber: true })}
        >
          <option value={0}>Seleccionar...</option>
          {membershipTypes.map((mt) => (
            <option key={mt.id} value={mt.id}>
              {mt.name}
            </option>
          ))}
        </select>
        {errors.type && <div className="activityFormError">{errors.type.message}</div>}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button type="submit" className="activityPrimaryButton">Guardar</button>
        <button type="button" className="activitySecondaryButton" onClick={() => navigate('/membresias')}>
          Cancelar
        </button>
      </div>
    </form>
    </div>
  );
}