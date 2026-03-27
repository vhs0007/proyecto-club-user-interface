import { Link, useParams } from 'react-router-dom'
import type { FacilityResponse } from '../../entities/Entities'
import { useFacilityStore } from '../../store/store'
import EditFacilityFormFirstStep from '../../components/facilities/EditFacilityFormFirstStep'

export default function EditFacilityFirstStep() {
  const { id } = useParams<{ id: string }>()
  const identifier = id ? parseInt(id, 10) : NaN
  const facility: FacilityResponse | null = useFacilityStore((state) => {
    if (!Number.isNaN(identifier)) {
      return state.getFacility(identifier)
    }
    return null
  })

  if (!facility) return null

  return (
    <div className="container">
      <Link to="/instalaciones" className="pageBackButton mb-3">
        ← Atrás
      </Link>
      <h1>Editar Instalación</h1>
      <EditFacilityFormFirstStep facility={facility} />
    </div>
  )
}

