import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from '../../config/axios';
import { useMembershipTypeStore } from '../../store/store';
import type { MembershipType } from '../../entities/Entities';

export interface DeleteMembershipTypeFormProps {
  membershipType: MembershipType;
}

export default function DeleteMembershipTypeForm({ membershipType }: DeleteMembershipTypeFormProps) {
  const navigate = useNavigate();
  const deleteMembershipType = useMembershipTypeStore((s) => s.deleteMembershipType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await AxiosInstance.delete(`/membership-type/${membershipType.id}`);
      deleteMembershipType(membershipType.id);
      navigate('/tipos-membresia');
    } catch {
      setError('No se pudo eliminar el tipo de membresía. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          ¿Estás seguro de que querés eliminar este tipo de membresía?
        </div>

        <div>
          <label className="activityFormLabel">Nombre</label>
          <input
            type="text"
            readOnly
            disabled
            value={membershipType.name}
            aria-label="Nombre"
            className="activityFormControl bg-slate-50"
          />
        </div>

        <div>
          <label className="activityFormLabel">Precio</label>
          <input
            type="text"
            readOnly
            disabled
            value={
              typeof membershipType.price === 'number'
                ? `$${membershipType.price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : '-'
            }
            aria-label="Precio"
            className="activityFormControl bg-slate-50"
          />
        </div>

        {error && <p className="activityFormError">{error}</p>}

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button type="submit" className="activityDangerButton" disabled={loading}>
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
          <button type="button" className="activitySecondaryButton" onClick={() => navigate('/tipos-membresia')}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
