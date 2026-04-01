import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../../config/axios';
import { useClubIdStore, useMembershipTypeStore } from '../../store/store';
import type { MembershipType } from '../../entities/Entities';

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
});

type FormData = z.infer<typeof schema>;

const errBorder = (has: boolean) =>
  has ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : '';

export interface EditMembershipTypeFormProps {
  membershipType: MembershipType;
}

export default function EditMembershipTypeForm({ membershipType }: EditMembershipTypeFormProps) {
  const navigate = useNavigate();
  const updateMembershipType = useMembershipTypeStore((s) => s.updateMembershipType);
  const clubId = useClubIdStore((s) => s.clubId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: membershipType.name,
      price: membershipType.price,
    },
  });

  useEffect(() => {
    reset({
      name: membershipType.name,
      price: membershipType.price,
    });
  }, [membershipType, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await AxiosInstance.patch<MembershipType>(`/membership-type/${membershipType.id}`, {
        name: data.name,
        price: data.price,
      });
      const updated = response.data;
      if (updated) {
        updateMembershipType({
          ...updated,
          clubId: updated.clubId ?? membershipType.clubId ?? clubId,
        });
        navigate('/tipos-membresia');
      }
    } catch {
      alert('No se pudo actualizar el tipo de membresía.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="mt-edit-name" className="activityFormLabel">
            Nombre
          </label>
          <input
            id="mt-edit-name"
            type="text"
            className={`activityFormControl ${errBorder(!!errors.name)}`}
            {...register('name')}
          />
          {errors.name && <div className="activityFormError">{errors.name.message}</div>}
        </div>

        <div>
          <label htmlFor="mt-edit-price" className="activityFormLabel">
            Precio
          </label>
          <input
            id="mt-edit-price"
            type="number"
            step="0.01"
            min={0}
            className={`activityFormControl ${errBorder(!!errors.price)}`}
            {...register('price', { valueAsNumber: true })}
          />
          {errors.price && <div className="activityFormError">{errors.price.message}</div>}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button type="submit" className="activityPrimaryButton">
            Guardar
          </button>
          <button type="button" className="activitySecondaryButton" onClick={() => navigate('/tipos-membresia')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
