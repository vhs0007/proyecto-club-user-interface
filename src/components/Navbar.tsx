import { useNavigate, Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const getLinkClass = (path: string) => {
    return `navbar-link ${location.pathname === path ? 'navbar-link-active' : ''}`
  }

  return (
    <nav className="navbar">
      <div className="container flex-between">
        <h2
          onClick={() => navigate('/home')}
          className="navbar-brand"
        >
          Peñarol
        </h2>

        <div className="flex-row gap-xl">
          <Link to="/usuarios" className={getLinkClass('/usuarios')}>
            Usuarios
          </Link>

          <Link to="/actividades" className={getLinkClass('/actividades')}>
            Actividades
          </Link>
        </div>
      </div>
    </nav>
  )
}
