import { useNavigate } from 'react-router-dom'
import type { UserResponse, UserType } from '../../entities/Entities'
import { useClubIdStore, useUserStore, useUserTypeStore } from '../../store/store'
import AxiosInstance from '../../config/axios'
import { useState } from 'react'

export interface DeleteUserFormProps {
  user: UserResponse | null
}

export default function DeleteUserForm({ user }: DeleteUserFormProps) {
  const navigate = useNavigate()
  const deleteUser = useUserStore((state) => state.deleteUser)
  const getUserType = useUserTypeStore((state) => state.getUserType)
  const clubId = useClubIdStore((state) => state.clubId)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const typeId = user?.type?.id ?? user?.typeId
  const userType: UserType | null = typeId != null ? getUserType(typeId) : null
  const listPath = typeId === 2 ? '/miembros' : '/trabajadores'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || clubId <= 0) return

    setLoading(true)
    setError(null)

    try {
      await AxiosInstance.delete(`/users/${user.id}?clubId=${clubId}`)
      deleteUser(user.id)
      navigate(listPath)
    } catch {
      setError('No se pudo eliminar el usuario. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-700">¿Estás seguro de que querés eliminar este usuario?</p>

        <div className="space-y-1.5">
          <label htmlFor="delete-user-id" className="block text-sm font-medium text-slate-700">ID</label>
          <input
            id="delete-user-id"
            type="number"
            value={user.id}
            disabled
            readOnly
            className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="delete-user-name" className="block text-sm font-medium text-slate-700">Nombre</label>
          <input
            id="delete-user-name"
            type="text"
            value={user.name}
            disabled
            readOnly
            className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="delete-user-type" className="block text-sm font-medium text-slate-700">Tipo</label>
          <input
            id="delete-user-type"
            type="text"
            value={userType?.name ?? ''}
            disabled
            readOnly
            className="w-full rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            onClick={() => navigate(listPath)}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

