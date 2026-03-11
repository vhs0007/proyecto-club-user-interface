import { useNavigate } from "react-router-dom";

export default function MembershipList() {
  const navigate = useNavigate();
  return (
    <div className="container">
        <h1>Membresías</h1>
        <button className="btn btn-primary" onClick={() => navigate(`/membresias/crear`)}>Crear Membresía</button>
    <table className="table table-striped table-hover table-responsive">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Membresía 1</td>
                <td>Descripción 1</td>
                <td>100</td>
                <td><button className="btn btn-primary" onClick={() => navigate(`/membresias/editar/${1}`)}>Editar</button>
                <button className="btn btn-danger" onClick={() => navigate(`/membresias/eliminar/${1}`)}>Eliminar</button></td>
            </tr>
        </tbody>
    </table>
    </div>
  )
}