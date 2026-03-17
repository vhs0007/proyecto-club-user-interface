import { useParams } from 'react-router-dom'
import type { FacilityResponse } from '../../entities/Entities'
import { useFacilityStore } from '../../store/store'
import EditFacilityFormSecondStep from '../../components/facilities/EditFacilityFormSecondStep'

export default function EditFacilitySecondStep() {
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
      <h1>Editar Instalación</h1>
      <EditFacilityFormSecondStep facility={facility} />
    </div>
  )
}

