import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClubIdStore, useMembershipTypeStore } from "../../store/store";
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
    
    try {
      const membership = {
        ...data,
        clubId: useClubIdStore.getState().clubId,
      }
      const response = await Axios.post('/membership', membership);
      console.log(response);
      if (response.status === 201 && response.data) {
        const membershipres = {
          id: response.data.id,
          clubId: response.data.clubId,
          user: response.data.user,
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
