import CreateFacilityFormSecondStep from '../../components/facilities/CreateFacilityFormSecondStep'
import { Link } from 'react-router-dom'
export default function CreateFacilitySecondStep() {
  return (
    <div className="container">
        <Link to="/instalaciones" className="pageBackButton mb-3">
          ← Atrás
        </Link>
        <h1>Crear Instalación</h1>
        <CreateFacilityFormSecondStep />
    </div>
  )
}