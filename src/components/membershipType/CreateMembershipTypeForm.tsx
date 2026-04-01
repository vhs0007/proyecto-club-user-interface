import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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

export default function CreateMembershipTypeForm() {
  const navigate = useNavigate();
  const setMembershipType = useMembershipTypeStore((s) => s.setMembershipType);
  const clubId = useClubIdStore((s) => s.clubId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', price: 0 },
  });

  const onSubmit = async (data: FormData) => {
    if (clubId <= 0) {
      alert('Seleccioná un club en sincronización antes de crear un tipo de membresía.');
      return;
    }
    try {
      const response = await AxiosInstance.post<MembershipType>('/membership-type', {
        name: data.name,
        price: data.price,
        clubId,
      });
      const created = response.data;
      if (created) {
        const withClub: MembershipType = {
          ...created,
          clubId: created.clubId ?? clubId,
        };
        setMembershipType(withClub);
        navigate('/tipos-membresia');
      }
    } catch {
      alert('No se pudo crear el tipo de membresía.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="mt-name" className="activityFormLabel">
            Nombre
          </label>
          <input
            id="mt-name"
            type="text"
            className={`activityFormControl ${errBorder(!!errors.name)}`}
            placeholder="Ej: Premium"
            {...register('name')}
          />
          {errors.name && <div className="activityFormError">{errors.name.message}</div>}
        </div>

        <div>
          <label htmlFor="mt-price" className="activityFormLabel">
            Precio
          </label>
          <input
            id="mt-price"
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
