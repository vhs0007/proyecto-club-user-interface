import { useNavigate } from 'react-router-dom'
import type { UserResponse, UserType } from '../../entities/Entities'
import { useUserStore, useUserTypeStore } from '../../store/store'
import AxiosInstance from '../../config/axios'
import { useState } from 'react'

export interface DeleteUserFormProps {
  user: UserResponse | null
}

export default function DeleteUserForm({ user }: DeleteUserFormProps) {
  const navigate = useNavigate()
  const deleteUser = useUserStore((state) => state.deleteUser)
  const getUserType = useUserTypeStore((state) => state.getUserType)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const typeId = user?.type?.id ?? user?.typeId
  const userType: UserType | null = typeId != null ? getUserType(typeId) : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setLoading(true)
    setError(null)

    try {
      await AxiosInstance.delete(`/users/${user.id}`)
      deleteUser(user.id)
      navigate('/usuarios')
    } catch {
      setError('No se pudo eliminar el usuario. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-3">¿Estás seguro de que querés eliminar este usuario?</p>

      <div className="mb-3">
        <label className="form-label">ID</label>
        <input type="number" value={user.id} disabled readOnly className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input type="text" value={user.name} disabled readOnly className="form-control" />
      </div>

      <div className="mb-3">
        <label className="form-label">Tipo</label>
        <input
          type="text"
          value={userType?.name ?? ''}
          disabled
          readOnly
          className="form-control"
        />
      </div>

      {error && <p className="text-danger mb-2">{error}</p>}

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-danger" disabled={loading}>
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/usuarios')}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

