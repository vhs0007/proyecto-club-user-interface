import { useState } from 'react';
import { useClubIdStore } from '../../store/store';
import MonthIncomeProgressionTable from './MonthIncomeProgressionTable';

export default function MonthIncomeProgressionCard() {
  const clubIdFromStore = useClubIdStore((state) => state.clubId);
  const [monthStartValue, setMonthStartValue] = useState('');
  const [monthEndValue, setMonthEndValue] = useState('');
  const [selectedDateForApiStart, setSelectedDateForApiStart] = useState('');
  const [selectedDateForApiEnd, setSelectedDateForApiEnd] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = clubIdFromStore;
    if (c <= 0 || !monthStartValue.trim() || !monthEndValue.trim() || monthStartValue > monthEndValue) return;
 
    const dateStartForApi = `${monthStartValue}T12:00:00.000Z`;
    const dateEndForApi = `${monthEndValue}T12:00:00.000Z`;
    setSelectedDateForApiStart(dateStartForApi);
    setSelectedDateForApiEnd(dateEndForApi);
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
          <label className="form-label" htmlFor="dateStart">Fecha de inicio</label>
          <input
            id="dateStart"
            type="date"
            title="Fecha de inicio del reporte"
            className="form-control"
            value={monthStartValue}
            onChange={(e) => setMonthStartValue(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label" htmlFor="dateEnd">Fecha de fin</label>
          <input
            id="dateEnd"
            type="date"
            title="Fecha de fin del reporte"
            className="form-control"
            value={monthEndValue}
            min={monthStartValue || undefined}
            onChange={(e) => setMonthEndValue(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button
            type="submit"
            className="btn btn-club-primary"
            disabled={!monthStartValue || !monthEndValue}
          >
            Generar
          </button>
        </div>
      </form>
      {selectedDateForApiStart && selectedDateForApiEnd ? (
        <MonthIncomeProgressionTable
          clubId={clubIdFromStore}
          dateForApiStart={selectedDateForApiStart}
          dateForApiEnd={selectedDateForApiEnd}
        />
      ) : null}
    </div>
  );
}
