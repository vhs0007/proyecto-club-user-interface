import { Link, useParams } from 'react-router-dom'
import type { FacilityResponse } from '../../entities/Entities'
import { useFacilityStore } from '../../store/store'
import DeleteFacilityForm from '../../components/facilities/DeleteFacilityForm'

export default function DeleteFacility() {
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
      <h1>Eliminar Instalación</h1>
      <DeleteFacilityForm facility={facility} />
    </div>
  )
}

