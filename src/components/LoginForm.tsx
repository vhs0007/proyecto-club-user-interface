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
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1e293b',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '30px',
        border: '1px solid white'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '20px',
          marginTop: 0
        }}>
          Iniciar sesión
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.email ? 'red' : '#ccc'}`,
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="ejemplo@email.com"
            />
            {errors.email && (
              <p style={{ fontSize: '12px', color: 'red', marginTop: '4px', marginBottom: 0 }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
              Contraseña
            </label>
            <input
              type="password"
              {...register('password')}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px solid ${errors.password ? 'red' : '#ccc'}`,
                borderRadius: '4px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
              placeholder="••••••••"
            />
            {errors.password && (
              <p style={{ fontSize: '12px', color: 'red', marginTop: '4px', marginBottom: 0 }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {errors.root && (
            <div style={{
              backgroundColor: '#fee',
              color: 'red',
              fontSize: '14px',
              padding: '10px',
              borderRadius: '4px',
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              {errors.root.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              backgroundColor: '#eab308',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.6 : 1,
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}