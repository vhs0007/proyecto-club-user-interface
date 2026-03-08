import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import api from '../../config/api'
import { useAuthStore } from '../../store/authStore'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post('/auth/login', data)

      if (response.status === 200) {
        setToken(response.data.accessToken)
        navigate('/home')
      }
    } catch (error: any) {
      setError('root', {
        message:
          error.response?.data?.message || 'Credenciales inválidas',
      })
    }
  }

  return (
    <div className="bg-club-dark page-fullscreen d-flex align-items-center justify-content-center">
      <div className="card shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4">
            Iniciar sesión
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">
                Email
              </label>
              <input
                type="email"
                {...register('email')}
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="ejemplo@email.com"
              />
              {errors.email && (
                <div className="invalid-feedback">
                  {errors.email.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Contraseña
              </label>
              <input
                type="password"
                {...register('password')}
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>

            {errors.root && (
              <div className="alert alert-danger text-center py-2">
                {errors.root.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-club-primary w-100 py-2"
            >
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
