import { useState } from 'react';
import { useClubIdStore } from '../../store/store';
import MonthIncomeReportTable from './MonthIncomeReportTable';

export default function MonthIncomeReportCard() {
  const clubIdFromStore = useClubIdStore((state) => state.clubId);
  const [monthValue, setMonthValue] = useState('');
  const [selectedDateForApi, setSelectedDateForApi] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = clubIdFromStore;
    if (c <= 0 || !monthValue.trim()) return;
 
    const dateForApi = `${monthValue}T12:00:00.000Z`;
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
          <label className="form-label" htmlFor="monthDate">Mes del reporte</label>
          <input
            id="monthDate"
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
            disabled={!monthValue}
          >
            Generar
          </button>
        </div>
      </form>
      {selectedDateForApi ? (
        <MonthIncomeReportTable
          clubId={clubIdFromStore}
          dateForApi={selectedDateForApi}
        />
      ) : null}
    </div>
  );
}
