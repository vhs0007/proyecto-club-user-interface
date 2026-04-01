import { useEffect, useState } from 'react';
import Axios from '../../config/axios';
import type { NewUsersReportResponse } from '../../entities/Entities';

interface NewUsersReportTableProps {
  clubId: number;
  typeId: number;
  dateForApi: string;
}

export default function NewUsersReportTable({ clubId, typeId, dateForApi }: NewUsersReportTableProps) {
  const [data, setData] = useState<NewUsersReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clubId <= 0 || typeId <= 0 || !dateForApi.trim()) {
      setData(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Axios.get<NewUsersReportResponse>('/reports/newUsers', {
      params: { clubId, typeId, date: dateForApi },
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
  }, [clubId, typeId, dateForApi]);

  if (loading) {
    return <div className="mt-3 text-muted">Cargando reporte...</div>;
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <div className="table-responsive mt-3">
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Registro</th>
          </tr>
        </thead>
        <tbody>
          {data?.users?.length ? (
            data.users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.type?.name ?? u.typeId}</td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-muted">
                {data ? `Total: ${data.totalUsers}` : 'Sin datos'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
