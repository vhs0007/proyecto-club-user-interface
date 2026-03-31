import { useState } from 'react';
import { useClubIdStore, useUserTypeStore } from '../../store/store';
import NewUsersReportTable from './NewUsersReportTable';

export default function NewUsersReportCard() {
  const clubIdFromStore = useClubIdStore((state) => state.clubId);
  const userTypes = useUserTypeStore((state) => state.userTypes);
  const [typeId, setTypeId] = useState('');
  const [monthValue, setMonthValue] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState<number>(0);
  const [selectedDateForApi, setSelectedDateForApi] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = clubIdFromStore;
    const t = parseInt(typeId, 10);
    if (c <= 0 || !Number.isFinite(t) || !monthValue.trim()) return;
 
    const dateForApi = `${monthValue}T12:00:00.000Z`;
    setSelectedTypeId(t);
    setSelectedDateForApi(dateForApi);
  };

  return (
    <div className="space-y-4">
      {clubIdFromStore <= 0 && (
        <p className="text-muted small mb-2">
          Definí el club en sincronización / sesión para usar este reporte.
        </p>
      )}
      <form onSubmit={onSubmit} className="row g-3">
        <div className="col-md-4">
          <label className="form-label" htmlFor="nu-type">Tipo de usuario</label>
          <select
            id="nu-type"
            className="form-control"
            value={typeId}
            onChange={(e) => setTypeId(e.target.value)}
          >
            <option value="">Selecciona un tipo</option>
            {userTypes
              .filter((ut) => ut.clubId === clubIdFromStore)
              .map((ut) => (
                <option key={ut.id} value={String(ut.id)}>
                  {ut.name}
                </option>
              ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="monthDa">Mes del reporte</label>
          <input
            id="monthDa"
            type="month"
            title="Mes del reporte"
            className="form-control"
            value={monthValue}
            onChange={(e) => setMonthValue(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button
            type="submit"
            className="btn btn-club-primary"
            disabled={!typeId || !monthValue}
          >
            Generar
          </button>
        </div>
      </form>
      {selectedDateForApi ? (
        <NewUsersReportTable
          clubId={clubIdFromStore}
          typeId={selectedTypeId}
          dateForApi={selectedDateForApi}
        />
      ) : null}
    </div>
  );
}
