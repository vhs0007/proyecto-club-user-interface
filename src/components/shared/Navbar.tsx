import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/store'
//import { configuration} from 

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const logout = useAuthStore((state) => state.logout)

  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path
    return `nav-link nav-link-club ${
      isActive ? 'active nav-link-item nav-link-item-active' : 'nav-link-item nav-link-item-inactive'
    }`
  }

  return (
    <nav className="nav-club navbar navbar-expand-lg">
      <div className="container max-w-7xl mx-auto">
        <span
          onClick={() => navigate('/home')}
          className="nav-brand"
        >
          Peñarol
        </span>

        <button
          title="Toggle navigation"
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto nav-links">
            <li className="nav-item">
              <Link to="/usuarios" className={getLinkClass('/usuarios')}>
                Usuarios
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/actividades" className={getLinkClass('/actividades')}>
                Actividades
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/instalaciones" className={getLinkClass('/instalaciones')}>
                Instalaciones
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/membresias" className={getLinkClass('/membresias')}>
                Membresías
              </Link>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className="btn-danger"
                aria-label="Cerrar sesión"
                onClick={() => {
                  logout()
                  navigate('/login', { replace: true })
                }}
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
