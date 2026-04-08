import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClubIdStore, useMembershipTypeStore, useUserStore } from "../../store/store";
import { useMembershipStore } from "../../store/store";
import Axios from '../../config/axios';
import type { MembershipResponse } from "../../entities/Entities";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  type: z.number().min(1, "Seleccioná un tipo de membresía"),
  userId: z.number().min(1, "El usuario es requerido"),
});

export type CreateMembershipFormData = z.infer<typeof schema>;

export default function CreateMembershipForm() {
  debugger;
  const membershipTypes = useMembershipTypeStore((state) => state.membershipTypes);
  const setMembership = useMembershipStore((state) => state.setMembership);
  const users = useUserStore((state) => state.users);
  console.log("membership types en el form", membershipTypes);
  const navigate = useNavigate();
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
    debugger;
    console.log(data);
    const user = users.find((u) => u.id === data.userId);
    const userType = user?.typeId;
    try {
      const membership = {
        ...data,
        clubId: useClubIdStore.getState().clubId,
        userTypeId: userType,
      }
      const response = await Axios.post('/membership', membership);
      console.log(response);
      if (response.status === 201 && response.data) {
        const membershipres = {
          id: response.data.id,
          clubId: response.data.clubId,
          user: response.data.user,
          createdAt: response.data.createdAt,
          membershipType: response.data.membershipType,
          expiration: response.data.expiration,
        } as MembershipResponse;
        setMembership(membershipres);
        navigate('/membresias');
      }
    } catch (error) {
      console.log(error);
      alert('Error al crear la membresía');
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="activityFormLabel">Tipo de membresía</label>
        <select
          className={`activityFormControl ${errors.type ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
          {...register("type", { valueAsNumber: true })}
        >
          <option value={0}>Seleccioná un tipo de membresía</option>
          {membershipTypes.map((mt) => (
            <option key={mt.id} value={mt.id}>
              {mt.name}
            </option>
          ))}
        </select>
        {errors.type && (
          <div className="activityFormError">{errors.type.message}</div>
        )}
      </div>

      <div>
        <label className="activityFormLabel">Usuario</label>
        <select
          id="userId"
          className={`activityFormControl ${errors.userId ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
          {...register("userId", { valueAsNumber: true })}
        >
          <option value={0}>Seleccioná un usuario</option>
          {users.filter((u) => u.typeId === 2).map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        {errors.userId && (
          <div className="activityFormError">{errors.userId.message}</div>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button type="submit" className="activityPrimaryButton">
          Guardar
        </button>
        <button type="button" className="activitySecondaryButton" onClick={() => navigate('/membresias')}>
          Cancelar
        </button>
      </div>
    </form>
    </div>
  );
}
