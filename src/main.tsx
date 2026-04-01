import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles.css'
import App from './App.tsx'
import { applyClubBrandingToRoot, DEFAULT_CLUB_BRANDING_COLORS } from './theme/clubBranding'

applyClubBrandingToRoot(DEFAULT_CLUB_BRANDING_COLORS)

createRoot(document.getElementById('root')!).render(

    <BrowserRouter>
      <App />
    </BrowserRouter>

)
