import { useEffect, useState } from 'react';
import type { SalaryReportResponse } from '../../entities/Entities';
import Axios from '../../config/axios';

export default function SalaryReportCard({ workerId }: { workerId: number }) {
  const [salaryReport, setSalaryReport] = useState<SalaryReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(workerId) || workerId <= 0) {
      setSalaryReport(null);
      return;
    }

    setLoading(true);
    setError(null);

    Axios.get<SalaryReportResponse>('/reports/salaries', { params: { userId: workerId } })
      .then((response) => {
        console.log(response.data);
        setSalaryReport(response.data);
      })
      .catch((e: unknown) => {
        console.log(e);
        setError(e instanceof Error ? e.message : 'Error al cargar el reporte');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [workerId]);

  if (loading) {
    return <div className="text-muted py-3">Cargando reporte…</div>;
  }

  if (error) {
    return <div className="text-danger py-3">{error}</div>;
  }

  if (!salaryReport) {
    return <div className="text-muted py-3">Seleccioná un usuario válido.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Salario</th>
            <th>Horas a trabajar por día</th>
            <th>Horas a trabajar por mes</th>
            <th>Horas extra</th>
            <th>Total a pagar</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span className="fw-semibold">{salaryReport.user.name}</span>
            </td>
            <td>
              <span className="badge bg-info">{salaryReport.salary}</span>
            </td>
            <td>
              <span className="badge bg-info">{salaryReport.user.hoursToWorkPerDay} h</span>
            </td>
            <td>
              <span className="badge bg-info">{(salaryReport.user.hoursToWorkPerDay ?? 0) * 30} h</span>
            </td>
            <td>
              <span className="badge bg-info">{salaryReport.extraHours} h</span>
            </td>
            <td>
              <span className="badge bg-info">{salaryReport.totalSalary}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
