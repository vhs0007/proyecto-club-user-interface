import SalaryReportCard from '../../components/reports/SalaryReportCard';
import { useParams } from 'react-router-dom';

export default function SalaryReportPage() {
  const { id } = useParams<{ id: string }>();
  const identifier = id ? parseInt(id, 10) : NaN;
  const valid = Number.isFinite(identifier) && identifier > 0;

  return (
    <div className="container py-4">
      <h1 className="mb-4">Reporte salarial</h1>
      {!valid ? (
        <p className="text-muted">ID de usuario inválido.</p>
      ) : (
        <SalaryReportCard workerId={identifier} />
      )}
    </div>
  );
}
