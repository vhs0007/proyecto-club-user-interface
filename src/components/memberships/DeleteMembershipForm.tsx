import { useNavigate } from "react-router-dom";

export default function DeleteMembershipForm() {
  const navigate = useNavigate();
  return (
    <form>
        <p>¿Estás seguro de querer eliminar esta membresía?</p>
        <input type="text" placeholder="Nombre" disabled className="form-control" />
        <input type="text" placeholder="Descripción" disabled className="form-control" />
        <input type="number" placeholder="Precio" disabled className="form-control" />
        <button type="submit" className="btn btn-danger">Eliminar</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/membresias')}>Cancelar</button>
    </form>
  )
}