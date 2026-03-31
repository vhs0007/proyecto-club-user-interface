import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/store';

export default function ReportSalaryForm() {
  const navigate = useNavigate();
  const users = useUserStore((state) => state.users);
  const [selectedId, setSelectedId] = useState<string>('');

  const options = useMemo(() => users, [users]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(selectedId, 10);
    if (!Number.isFinite(id) || id <= 0) return;
    navigate(`/reportes/salario/${id}`);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="report-salary-user" className="form-label">
          Usuario
        </label>
        <select
          id="report-salary-user"
          className="form-select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          required
        >
          <option value="">Elegí un usuario</option>
          {options.map((u) => (
            <option key={u.id} value={String(u.id)}>
              {u.name} (id {u.id})
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn btn-club-primary">
        Ver reporte
      </button>
    </form>
  );
}
