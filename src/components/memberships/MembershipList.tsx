import { useNavigate } from "react-router-dom";
import type { MembershipResponse } from "../../entities/Entities";
import { useEffect } from "react";

export default function MembershipList({ membershipsList }: { membershipsList: MembershipResponse[] }) {
  const navigate = useNavigate();
  useEffect(() => {
    console.log(membershipsList);
  }, [membershipsList]);
  return (
    <div className="container">
        <h1>Membresías</h1>
        <button className="btn btn-primary" onClick={() => navigate(`/membresias/crear`)}>Crear Membresía</button>
    <table className="table table-striped table-hover table-responsive">
        <thead>
            <tr>
                <th>ID</th>
                <th>Tipo</th>
                <th>Usuario</th>
                <th>Expiración</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            {membershipsList.map((membership) => (
                <tr key={membership.id}>
                    <td>{membership.id}</td>
                    <td>{membership.membershipType?.name ?? '-'}</td>
                    <td>{membership.user?.name ?? membership.user?.id ?? '-'}</td>
                    <td>{membership.expiration ? new Date(membership.expiration).toLocaleDateString() : '-'}</td>
                    <td><button className="btn btn-primary" onClick={() => navigate(`/membresias/editar/${membership.id}`)}>Editar</button>
                    <button className="btn btn-danger" onClick={() => navigate(`/membresias/eliminar/${membership.id}`)}>Eliminar</button></td>
                </tr>
            ))}
        </tbody>
    </table>
    </div>
  )
}