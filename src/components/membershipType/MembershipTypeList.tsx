import { useNavigate } from 'react-router-dom';
import type { MembershipType } from '../../entities/Entities';

export default function MembershipTypeList({ items }: { items: MembershipType[] }) {
  const navigate = useNavigate();

  const formatPrice = (price: number) =>
    typeof price === 'number' ? `$${price.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-';

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200/80 bg-white -mx-0.5">
      <table className="min-w-full align-middle">
        <thead className="bg-slate-50">
          <tr>
            <th className="listTableTh">ID</th>
            <th className="listTableTh">Nombre</th>
            <th className="listTableTh">Precio</th>
            <th className="listTableThCenter">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((mt) => (
            <tr key={mt.id} className="hover:bg-slate-50/70">
              <td className="listTableTd">{mt.id}</td>
              <td className="listTableTd">
                <span className="font-semibold text-slate-800">{mt.name}</span>
              </td>
              <td className="listTableTd">{formatPrice(mt.price)}</td>
              <td className="listTableTd text-center">
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    className="listActionBtnEdit"
                    onClick={() => navigate(`/tipos-membresia/editar/${mt.id}`)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    type="button"
                    className="listActionBtnDelete"
                    onClick={() => navigate(`/tipos-membresia/eliminar/${mt.id}`)}
                    title="Eliminar"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="mt-5 rounded-md border border-dashed border-slate-200 bg-slate-50/90 py-12 text-center text-sm text-slate-500">
          No hay tipos de membresía registrados
        </div>
      )}
    </div>
  );
}
