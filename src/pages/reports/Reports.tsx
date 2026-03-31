import { useState } from 'react';
import { Link } from 'react-router-dom';
import NewUsersReportCard from '../../components/reports/NewUsersReportCard';
import MonthIncomeReportCard from '../../components/reports/MonthIncomeReportCard';

type ReportSection = 'salary' | 'newUsers' | 'monthIncome';

export default function Reports() {
  const [section, setSection] = useState<ReportSection>('salary');

  return (
    <div className="container max-w-7xl mx-auto py-4 px-3 md:py-5 md:px-4">
      <div className="mb-6 border-b border-slate-200/90 pb-4">
        <h2 className="mb-1 text-2xl font-bold tracking-tight text-slate-800">Reportes</h2>
        <p className="text-sm text-slate-500">Panel reportes</p>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
        <div className="p-4 md:p-6">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
            <h3 className="text-lg font-bold tracking-tight text-slate-800 mb-0">Reportes</h3>
            <div className="d-flex gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => setSection('salary')}
              >
                Reporte salarial
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => setSection('newUsers')}
              >
                Reporte de nuevos usuarios
              </button>
              <button
              type="button"
              className='btn btn-outline-primary'
              onClick={() => setSection('monthIncome')}>
                Reporte de ingresos mensuales
              </button>
            </div>
          </div>

          {section === 'salary' ? (
            <div className="py-3">
              <p className="text-muted mb-3">Elegí un usuario para generar el reporte salarial.</p>
              <Link to="/reportes/salario/paso-1" className="btn btn-club-primary">
                <i className="bi bi-arrow-right-circle me-2" />
                Nuevo reporte salarial
              </Link>
            </div>
          ) : null}

          {section === 'newUsers' ? <NewUsersReportCard /> : null}
          {section === 'monthIncome' ? <MonthIncomeReportCard /> : null}
        </div>
      </div>
    </div>
  );
}
