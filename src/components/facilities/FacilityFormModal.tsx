import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { useAuthStore } from '../../store/store';

interface Facility {
  id: number;
  tipo: string;
  horarioDisponible: string;
  aforo: number;
  trabajadorEncargado: number;
  trabajadorAyudante: number | null;
}

interface FacilityFormModalProps {
  facility: Facility | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FacilityFormModal({ facility, onClose, onSuccess }: FacilityFormModalProps) {
  const token = useAuthStore((state) => state.token);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [tipo, setTipo] = useState('');
  const [horarioDisponible, setHorarioDisponible] = useState('');
  const [aforo, setAforo] = useState('');
  const [trabajadorEncargado, setTrabajadorEncargado] = useState('');
  const [trabajadorAyudante, setTrabajadorAyudante] = useState('');

  const isEditing = facility !== null;

  useEffect(() => {
    if (facility) {
      setTipo(facility.tipo);
      setHorarioDisponible(facility.horarioDisponible);
      setAforo(facility.aforo.toString());
      setTrabajadorEncargado(facility.trabajadorEncargado.toString());
      setTrabajadorAyudante(facility.trabajadorAyudante?.toString() || '');
    }
  }, [facility]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      tipo,
      horarioDisponible,
      aforo: Number(aforo),
      trabajadorEncargado: Number(trabajadorEncargado),
      trabajadorAyudante: trabajadorAyudante ? Number(trabajadorAyudante) : undefined,
    };

    try {
      if (isEditing && facility) {
        await api.patch(`/facilities/${facility.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/facilities', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess();
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
                  <label htmlFor="tipo" className="form-label">Tipo *</label>
                  <input
                    type="text"
                    id="tipo"
                    className="form-control"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    placeholder="Ej: Piscina, Gimnasio"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="horarioDisponible" className="form-label">Horario Disponible *</label>
                  <input
                    type="text"
                    id="horarioDisponible"
                    className="form-control"
                    value={horarioDisponible}
                    onChange={(e) => setHorarioDisponible(e.target.value)}
                    placeholder="08:00-22:00"
                    required
                  />
                </div>
                <div className="col-12">
                  <label htmlFor="aforo" className="form-label">Aforo *</label>
                  <input
                    type="number"
                    id="aforo"
                    className="form-control"
                    value={aforo}
                    onChange={(e) => setAforo(e.target.value)}
                    placeholder="Capacidad máxima"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="trabajadorEncargado" className="form-label">Encargado (ID) *</label>
                  <input
                    type="number"
                    id="trabajadorEncargado"
                    className="form-control"
                    value={trabajadorEncargado}
                    onChange={(e) => setTrabajadorEncargado(e.target.value)}
                    placeholder="ID del encargado"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="trabajadorAyudante" className="form-label">Ayudante (ID)</label>
                  <input
                    type="number"
                    id="trabajadorAyudante"
                    className="form-control"
                    value={trabajadorAyudante}
                    onChange={(e) => setTrabajadorAyudante(e.target.value)}
                    placeholder="Opcional"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-club-primary" disabled={loading}>
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

