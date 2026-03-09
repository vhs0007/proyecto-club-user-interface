import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import Login from '../pages/login/Login';
import Home from '../pages/home/Home';
import Facilities from '../pages/facilities/Facilities';
import Users from '../pages/users/Users';
import Activities from '../pages/activities/Activities';
import Navbar from '../components/shared/Navbar';
import Membership from '../pages/memberships/Membership';
import CreateMembership from '../pages/memberships/CreateMembership';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function AppRouter() {
  const token = useAuthStore((state) => state.token);

  return (
    <>
      {token && <Navbar />}
      <Routes>
        <Route
          path="/login"
          element={token ? <Navigate to="/home" replace /> : <Login />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instalaciones"
          element={
            <ProtectedRoute>
              <Facilities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/actividades"
          element={
            <ProtectedRoute>
              <Activities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/membresias"
          element={
            <ProtectedRoute>
              <Membership />
            </ProtectedRoute>
          }
        />
        <Route
          path="/membresias/crear"
          element={
            <ProtectedRoute>
              <CreateMembership />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={token ? '/home' : '/login'} replace />} />
      </Routes>
    </>
  );
}
