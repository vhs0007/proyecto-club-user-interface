import CreateFacilityFormFirstStep from '../../components/facilities/CreateFacilityFormFirstStep'
import { Link } from 'react-router-dom'

export default function CreateFacility() {
  return (
    <div className="container">
        <Link to="/instalaciones" className="pageBackButton mb-3">
          ← Atrás
        </Link>
        <h1>Crear Instalación</h1>
        <CreateFacilityFormFirstStep />
    </div>
  )
}