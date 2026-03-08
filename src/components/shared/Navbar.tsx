import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const getLinkClass = (path: string) => {
    return `nav-link nav-link-club ${location.pathname === path ? 'active' : ''}`
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-club py-3">
      <div className="container">
        <span
          onClick={() => navigate('/home')}
          className="navbar-brand navbar-brand-club fs-4"
        >
          Peñarol
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-3">
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
          </ul>
        </div>
      </div>
    </nav>
  )
}
