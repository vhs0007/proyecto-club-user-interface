import { useEffect, useState } from 'react';
import Axios from '../../config/axios';
import type { MonthIncomeReportResponse } from '../../entities/Entities';
import BarReportIncomeMonth from './BarReportIncomeMonth';

interface MonthIncomeReportTableProps {
  clubId: number;
  dateForApi: string;
}

export default function MonthIncomeReportTable({ clubId, dateForApi }: MonthIncomeReportTableProps) {
  const [data, setData] = useState<MonthIncomeReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 
  useEffect(() => {
    if (clubId <= 0 || !dateForApi.trim()) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Axios.get<MonthIncomeReportResponse>('/reports/monthIncome', {
      params: { clubId, date: dateForApi },
    })
      .then((res) => {
        if (!cancelled) setData(res.data);
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
  }, [clubId, dateForApi]);

  if (loading) {
    return <div className="mt-3 text-muted">Cargando reporte...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <div className="table-responsive mt-3">
      <BarReportIncomeMonth data={data} />
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Ingresos totales</th>
            <th>Ingresos de membresías</th>
            <th>Ingresos de actividades</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data?.monthIncomeTotal}</td>
            <td>{data?.monthIncomeMemberships}</td>
            <td>{data?.monthIncomeActivities}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
