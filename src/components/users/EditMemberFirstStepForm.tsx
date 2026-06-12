import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { MembershipResponse, UserResponse } from "../../entities/Entities";
import {
  useClubIdStore,
  useEditUserStore,
  useMembershipStore,
  useMembershipTypeStore,
  useUserStore,
} from "../../store/store";
import AxiosInstance from "../../config/axios";

const formSchema = z.object({
  name: z.string().min(1),
  typeId: z.number().min(1, "Seleccioná un tipo de usuario"),
  email: z.string().email(),
  document: z.string().min(1, "El documento es requerido"),
  membershipTypeId: z.number().min(1, "Seleccioná un tipo de membresía"),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

async function updateMembershipType(
  membershipId: number,
  membershipTypeId: number,
  user: UserResponse,
  clubId: number,
): Promise<MembershipResponse | null> {
  const response = await AxiosInstance.patch<MembershipResponse>(
    `/membership/${membershipId}?clubId=${clubId}`,
    {
      type: membershipTypeId,
      userId: user.id,
      userTypeId: user.typeId,
      clubId,
    },
  );
  return response.status === 200 ? response.data : null;
}

export default function EditMemberFirstStepForm({ user }: { user: UserResponse }) {
  const navigate = useNavigate();
  const clubId = useClubIdStore((state) => state.clubId);
  const membershipTypes = useMembershipTypeStore((state) => state.membershipTypes);
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
      typeId: user.typeId,
      email: user.email ?? "",
      document: user.document ?? "",
      membershipTypeId: user.membership?.membershipType?.id ?? 0,
      isActive: user.isActive,
    },
  });

  useEffect(() => {
    reset({
      name: user.name ?? "",
      typeId: user.typeId,
      email: user.email ?? "",
      document: user.document ?? "",
      membershipTypeId: user.membership?.membershipType?.id ?? 0,
      isActive: user.isActive,
    });
  }, [user, reset]);

  const onSubmit = async (data: FormData) => {
    useEditUserStore.getState().setFirstStep({
      name: data.name,
      typeId: data.typeId,
      email: data.email,
      document: data.document,
      isActive: data.isActive,
      membership: data.membershipTypeId,
    });

    if (user.type?.id === 3) {
      navigate(`/miembros/editar/${user.id}/paso-especifico-atleta`);
      return;
    }

    try {
      const response = await AxiosInstance.patch<UserResponse>(`/users/${user.id}`, {
        name: data.name,
        email: data.email,
        document: data.document,
        isActive: data.isActive,
        clubId,
        typeId: user.typeId,
      });

      if (response.status !== 200) return;

      let updatedUser = response.data;
      const currentMembershipTypeId = user.membership?.membershipType?.id;
      if (
        user.membership?.id &&
        data.membershipTypeId !== currentMembershipTypeId
      ) {
        const membershipResponse = await updateMembershipType(
          user.membership.id,
          data.membershipTypeId,
          user,
          clubId,
        );
        if (membershipResponse) {
          useMembershipStore.getState().updateMembership(membershipResponse);
          updatedUser = {
            ...updatedUser,
            membership: {
              id: membershipResponse.id,
              expiration: membershipResponse.expiration,
              createdAt: membershipResponse.createdAt,
              membershipType: membershipResponse.membershipType,
            },
          };
        }
      }

      useUserStore.getState().updateUser(updatedUser);
      navigate("/miembros");
    } catch (error) {
      alert("Error al actualizar el socio");
      console.error(error);
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
          <label htmlFor="document" className="block text-sm font-medium text-slate-700">
            Documento
          </label>
          <input
            id="document"
            type="text"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("document")}
          />
          {errors.document && <span className="text-sm text-red-600">{errors.document.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="membershipTypeId" className="block text-sm font-medium text-slate-700">
            Tipo de membresía
          </label>
          <select
            id="membershipTypeId"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            {...register("membershipTypeId", { valueAsNumber: true })}
          >
            <option value={0}>Seleccioná un tipo de membresía</option>
            {membershipTypes.map((membershipType) => (
              <option key={membershipType.id} value={membershipType.id}>
                {membershipType.name}
              </option>
            ))}
          </select>
          {errors.membershipTypeId && (
            <span className="text-sm text-red-600">{errors.membershipTypeId.message}</span>
          )}
        </div>

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
          {user.type?.id === 3 ? "Siguiente" : "Guardar"}
        </button>
      </form>
    </div>
  );
}
