import { useNavigate } from "react-router-dom";
import type { MembershipResponse } from "../../entities/Entities";
import { useEffect } from "react";

export default function MembershipList({ membershipsList }: { membershipsList: MembershipResponse[] }) {
  const navigate = useNavigate();
  useEffect(() => {
    console.log(membershipsList);
  }, [membershipsList]);
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm">
    <table className="min-w-full align-middle">
        <thead className="bg-slate-50">
            <tr>
                <th className="listTableTh">ID</th>
                <th className="listTableTh">Tipo</th>
                <th className="listTableTh">Usuario</th>
                <th className="listTableTh">Expiración</th>
                <th className="listTableThCenter">Acciones</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
            {membershipsList.map((membership) => (
                <tr key={membership.id} className="hover:bg-slate-50/70">
                    <td className="listTableTd">{membership.id}</td>
                    <td className="listTableTd">
                      <span className="listBadgeTypeInfo">{membership.membershipType?.name ?? '-'}</span>
                    </td>
                    <td className="listTableTd">{membership.user?.name ?? membership.user?.id ?? '-'}</td>
                    <td className="listTableTd">{membership.expiration ? new Date(membership.expiration).toLocaleDateString() : '-'}</td>
                    <td className="listTableTd text-center">
                      <div className="flex justify-center gap-2">
                        <button className="listActionBtnEdit" onClick={() => navigate(`/membresias/editar/${membership.id}`)}>Editar</button>
                        <button className="listActionBtnDelete" onClick={() => navigate(`/membresias/eliminar/${membership.id}`)}>Eliminar</button>
                      </div>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
    </div>
  )
}