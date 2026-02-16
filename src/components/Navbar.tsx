import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav style={{
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h2
          onClick={() => navigate('/home')}
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            margin: 0
          }}
        >
          Peñarol
        </h2>

        <div style={{
          display: 'flex',
          gap: '30px'
        }}>
          <Link
            to="/usuarios"
            style={{
              textDecoration: 'none',
              color: location.pathname === '/usuarios' ? '#000' : '#666',
              fontWeight: location.pathname === '/usuarios' ? 'bold' : 'normal'
            }}
          >
            Usuarios
          </Link>

          <Link
            to="/actividades"
            style={{
              textDecoration: 'none',
              color: location.pathname === '/actividades' ? '#000' : '#666',
              fontWeight: location.pathname === '/actividades' ? 'bold' : 'normal'
            }}
          >
            Actividades
          </Link>
        </div>
      </div>
    </nav>
  )
}
