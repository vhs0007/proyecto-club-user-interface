import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { useAuthStore, useMembershipTypeStore } from '../../store/store';
import type { Facility, FacilityResponse } from '../../entities/Entities';

interface FacilityFormModalProps {
  facility: FacilityResponse | null;
  onClose: () => void;
  onSuccess: (facility: FacilityResponse) => void;
}

export default function FacilityFormModal({ facility, onClose, onSuccess }: FacilityFormModalProps) {
  const token = useAuthStore((state) => state.token);
  const membershipTypes = useMembershipTypeStore((state) => state.membershipTypes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [type, setType] = useState('');
  const [capacity, setCapacity] = useState('');
  const [responsibleWorker, setResponsibleWorker] = useState('');
  const [assistantWorker, setAssistantWorker] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [membershipTypeIds, setMembershipTypeIds] = useState<number[]>([]);

  const isEditing = facility !== null;

  useEffect(() => {
    if (facility) {
      setType(facility.type);
      setCapacity(facility.capacity.toString());
      setResponsibleWorker(facility.responsibleWorker.id.toString());
      setAssistantWorker(facility.assistantWorker?.id?.toString() ?? '');
      setIsActive(facility.isActive);
      setMembershipTypeIds(facility.membershipTypes?.map((m) => m.id) ?? []);
    } else {
      setIsActive(true);
      setMembershipTypeIds([]);
    }
  }, [facility]);

  const toggleMembershipType = (id: number) => {
    setMembershipTypeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload: Facility = {
      type: type.trim(),
      capacity: Math.max(4, Number(capacity)),
      responsibleWorker: Number(responsibleWorker),
      assistantWorker: assistantWorker ? Number(assistantWorker) : null,
      isActive,
      membershipTypeIds,
    };
    if (isEditing && facility?.id) payload.id = facility.id;

    try {
      if (isEditing && facility?.id) {
        const response = await api.patch<FacilityResponse>(`/facilities/${facility.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onSuccess(response.data);
      } else {
        const response = await api.post<FacilityResponse>('/facilities', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        onSuccess(response.data);
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al guardar instalación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show d-block modal-backdrop-custom">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-light">
            <h5 className="modal-title">
              <i className={`bi ${isEditing ? 'bi-pencil-square' : 'bi-building-add'} me-2`}></i>
              {isEditing ? 'Editar Instalación' : 'Nueva Instalación'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger py-2 mb-3">
                  {error}
                </div>
              )}
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="type" className="form-label">Tipo *</label>
                  <input
                    type="text"
                    id="type"
                    className="form-control"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="Ej: Sala de musculación, Piscina"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="capacity" className="form-label">Capacidad (mín. 4) *</label>
                  <input
                    type="number"
                    id="capacity"
                    className="form-control"
                    min={4}
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="Capacidad máxima"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="responsibleWorker" className="form-label">Trabajador responsable (ID) *</label>
                  <input
                    type="number"
                    id="responsibleWorker"
                    className="form-control"
                    min={1}
                    value={responsibleWorker}
                    onChange={(e) => setResponsibleWorker(e.target.value)}
                    placeholder="ID del trabajador"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="assistantWorker" className="form-label">Trabajador asistente (ID)</label>
                  <input
                    type="number"
                    id="assistantWorker"
                    className="form-control"
                    min={1}
                    value={assistantWorker}
                    onChange={(e) => setAssistantWorker(e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
                <div className="col-12">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="isActive"
                      className="form-check-input"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <label htmlFor="isActive" className="form-check-label">Instalación activa</label>
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label">Tipos de membresía *</label>
                  <div className="border rounded p-2" style={{ maxHeight: 160, overflowY: 'auto' }}>
                    {membershipTypes.length === 0 ? (
                      <small className="text-muted">No hay tipos de membresía cargados. Sincronizá desde Inicio.</small>
                    ) : (
                      membershipTypes.map((mt) => (
                        <div key={mt.id} className="form-check">
                          <input
                            type="checkbox"
                            id={`mt-${mt.id}`}
                            className="form-check-input"
                            checked={membershipTypeIds.includes(mt.id)}
                            onChange={() => toggleMembershipType(mt.id)}
                          />
                          <label htmlFor={`mt-${mt.id}`} className="form-check-label">{mt.name}</label>
                        </div>
                      ))
                    )}
                  </div>
                  {membershipTypeIds.length === 0 && (
                    <small className="text-danger">Seleccioná al menos un tipo de membresía</small>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-club-primary"
                disabled={loading || membershipTypeIds.length === 0}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Guardando...
                  </>
                ) : (
                  isEditing ? 'Actualizar' : 'Crear'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
