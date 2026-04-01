import { useEffect, useState } from 'react';
import Axios from '../../config/axios';
import type { MonthIncomeReportResponse } from '../../entities/Entities';
import LineReportIncomeMonthlyProgression from './LineReportIncomeMonthlyProgression';
import type { MonthIncomeProgressionReportResponse } from '../../entities/Entities';
import LineReportMonthlyActivitiesMembership from './LineReportMonthlyActivitiesMembership';

interface MonthIncomeProgressionTableProps {
  clubId: number;
  dateForApiStart: string;
  dateForApiEnd: string;
}

function format(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return '—';
  }
  return value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function MonthIncomeProgressionTable({ clubId, dateForApiStart, dateForApiEnd }: MonthIncomeProgressionTableProps) {
  const [data, setData] = useState<MonthIncomeProgressionReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [monthlyIncomes, setMonthlyIncomes] = useState<MonthIncomeReportResponse[]>([]);

 
  useEffect(() => {
    if (clubId <= 0 || !dateForApiStart.trim() || !dateForApiEnd.trim()) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Axios.get<MonthIncomeProgressionReportResponse>('/reports/monthlyProgressionIncome', {
      params: { clubId, dateStart: dateForApiStart, dateEnd: dateForApiEnd },
    })
      .then((res) => {
        if (!cancelled) setData(res.data);
        if (!cancelled) setMonthlyIncomes(res.data.monthlyIncomes);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clubId, dateForApiStart, dateForApiEnd]);

  if (loading) {
    return <div className="mt-3 text-muted">Cargando reporte...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <div className="table-responsive mt-3">
      <LineReportIncomeMonthlyProgression data={monthlyIncomes} />
      <LineReportMonthlyActivitiesMembership data={monthlyIncomes} />
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Ingresos totales</th>
            <th>Ingreso totales membresías</th>
            <th>Ingreso totales actividades</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{format(data?.totalIncome)}</td>
            <td>{format(data?.totalIncomeMemberships)}</td>
            <td>{format(data?.totalIncomeActivities)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
