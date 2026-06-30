import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserList from '../../components/users/UserLIstMembers';
import { useUserStore } from '../../store/store';

type MemberFilter = 'all' | 'member' | 'athlete';

const filterTabs: { id: MemberFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'member', label: 'Miembros' },
  { id: 'athlete', label: 'Atletas' },
];

export default function MemberList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<MemberFilter>('all');
  const users = useUserStore((s) => s.users);
  const members = useMemo(
    () => users.filter((u) => u.typeId === 2 || u.typeId === 3),
    [users],
  );

  useEffect(() => {
    console.log('[MemberList] members', members);
  }, [members]);

  return (
    <div className="container max-w-7xl mx-auto py-4 px-3 md:py-5 md:px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-slate-200/90">
        <h2 className="mb-0 text-2xl font-bold tracking-tight text-slate-800">
          Gestión de Socios
        </h2>
        <button
          type="button"
          className="pageHeaderPrimaryButton"
          onClick={() =>
            navigate(`/miembros/crear/paso-general`)
          }
        >
          <i className="bi bi-plus-lg mr-2"></i>
          Nuevo Socio
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
        <div className="p-4 md:p-6">
          <div className="mb-4 inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={
                  filter === tab.id
                    ? 'rounded-md bg-white px-3 py-1.5 text-sm font-medium text-slate-900 shadow-sm'
                    : 'rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800'
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
          <UserList filter={filter} />
        </div>
      </div>
    </div>
  );
}
