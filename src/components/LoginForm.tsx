import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import api from '../config/api'
import { useAuthStore } from '../store/authStore'

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
    <div className="page-wrapper page-dark flex-center">
      <div className="card card-sm">
        <h2 className="title title-center mt-0">
          Iniciar sesión
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="ejemplo@email.com"
            />
            {errors.email && (
              <p className="form-error">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              {...register('password')}
              className={`form-input ${errors.password ? 'form-input-error' : ''}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="form-error">
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <div className="alert alert-error">
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-block btn-lg"
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}
