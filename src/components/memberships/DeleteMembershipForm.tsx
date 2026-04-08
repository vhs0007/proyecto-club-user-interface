import { useNavigate } from "react-router-dom";
import type { MembershipResponse } from "../../entities/Entities";
import { useClubIdStore, useMembershipStore } from "../../store/store";
import AxiosInstance from "../../config/axios";
import React, { useState } from "react";

export interface DeleteMembershipFormProps {
  membership: MembershipResponse | null;
}

const DeleteMembershipForm: React.FC<DeleteMembershipFormProps> = ({ membership }) => {
  const navigate = useNavigate();
  const deleteMembership = useMembershipStore((state) => state.deleteMembership);
  const clubIdFromStore = useClubIdStore((state) => state.clubId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typeName = membership?.membershipType?.name ?? (membership?.membershipType ? `Tipo #${membership.membershipType.id}` : "");
  const userName = membership?.user?.name ?? membership?.user?.id ?? "";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!membership?.id) return;
    const clubId = membership.clubId ?? clubIdFromStore;
    if (!clubId) return;
    setLoading(true);
    setError(null);
    try {
      await AxiosInstance.delete(`/membership/${membership.id}?clubId=${clubId}`);
      deleteMembership(membership.id);
      navigate("/membresias");
    } catch {
      setError("No se pudo eliminar la membresía. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!membership) return null;

  return (
    <div className="mx-auto w-full max-w-2xl">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
        ¿Estás seguro de que querés eliminar esta membresía?
      </div>

      <div>
        <label className="activityFormLabel">Tipo</label>
        <input type="text" value={typeName} readOnly disabled aria-label="Tipo" className="activityFormControl bg-slate-50" />
      </div>

      <div>
        <label className="activityFormLabel">Usuario</label>
        <input type="text" value={userName} readOnly disabled aria-label="Usuario" className="activityFormControl bg-slate-50" />
      </div>

      {error && <p className="activityFormError">{error}</p>}

      <div className="flex flex-wrap items-center gap-2 pt-2">
        <button type="submit" className="activityDangerButton" disabled={loading}>
          {loading ? "Eliminando..." : "Eliminar"}
        </button>
        <button type="button" className="activitySecondaryButton" onClick={() => navigate("/membresias")}>
          Cancelar
        </button>
      </div>
    </form>
    </div>
  );
};

export default DeleteMembershipForm;