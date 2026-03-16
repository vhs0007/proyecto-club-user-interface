import { useNavigate } from "react-router-dom";
import type { MembershipResponse } from "../../entities/Entities";
import { useMembershipStore } from "../../store/store";
import AxiosInstance from "../../config/axios";
import React, { useState } from "react";

export interface DeleteMembershipFormProps {
  membership: MembershipResponse | null;
}

const DeleteMembershipForm: React.FC<DeleteMembershipFormProps> = ({ membership }) => {
  const navigate = useNavigate();
  const deleteMembership = useMembershipStore((state) => state.deleteMembership);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typeName = membership?.membershipType?.name ?? (membership?.membershipType ? `Tipo #${membership.membershipType.id}` : "");
  const userName = membership?.user?.name ?? membership?.user?.id ?? "";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!membership?.id) return;
    setLoading(true);
    setError(null);
    try {
      await AxiosInstance.delete(`/membership/${membership.id}`);
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
    <form onSubmit={handleSubmit}>
      <p className="mb-3">¿Estás seguro de que querés eliminar esta membresía?</p>
      <div className="mb-3">
        <label className="form-label">Tipo</label>
        <input type="text" value={typeName} readOnly disabled className="form-control" />
      </div>
      <div className="mb-3">
        <label className="form-label">Usuario</label>
        <input type="text" value={userName} readOnly disabled className="form-control" />
      </div>
      {error && <p className="text-danger mb-2">{error}</p>}
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-danger" disabled={loading}>
          {loading ? "Eliminando..." : "Eliminar"}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate("/membresias")}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default DeleteMembershipForm;