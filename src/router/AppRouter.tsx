import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import Login from '../pages/login/Login';
import Home from '../pages/home/Home';
import FacilitiesList from '../pages/facilities/FacilitiesList';
import Users from '../pages/users/Users';
import Activities from '../pages/activities/Activities';
import CreateActivity from '../pages/activities/CreateActivity';
import CreateActivitySecondStep from '../pages/activities/CreateActivitySecondStep';
import Navbar from '../components/shared/Navbar';
import Membership from '../pages/memberships/MembershipList';
import CreateMembership from '../pages/memberships/CreateMembership';
import EditMembership from '../pages/memberships/EditMembership';
import DeleteMembership from '../pages/memberships/DeleteMembership';
import Sync from '../pages/sync/Sync';
import CreateFacilityFirstStep from '../pages/facilities/CreateFacilityFirstStep';
import CreateFacilitySecondStep from '../pages/facilities/CreateFacilitySecondStep';
import EditFacilityFirstStep from '../pages/facilities/EditFacilityFirstStep';
import EditFacilitySecondStep from '../pages/facilities/EditFacilitySecondStep';
import DeleteFacility from '../pages/facilities/DeleteFacility';
import CreateUserWorkerSpecific from '../pages/users/CreateUserWorkerSpecific';
import CreateUserAthleteSpecific from '../pages/users/CreateUserAthleteSpecific';
import EditUserFirstStep from '../pages/users/EditUserFirstStep';
import EditUserSecondStep from '../pages/users/EditUserSecondStep';
import DeleteUser from '../pages/users/DeleteUser';
import DeleteActivity from '../pages/activities/DeleteActivity';
import CreateUserFirstStep from '../pages/users/CreateUserFirstStep';
import EditActivityFirstStep from '../pages/activities/EditActivityFirstStep';
import EditActivitySecondStep from '../pages/activities/EditActivitySecondStep';
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
          element={token ? <Navigate to="/sincronizar" replace /> : <Login />}
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
              <FacilitiesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instalaciones/crear/paso-1"
          element={
            <ProtectedRoute>
              <CreateFacilityFirstStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instalaciones/crear/paso-2"
          element={
            <ProtectedRoute>
              <CreateFacilitySecondStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instalaciones/editar/:id/paso-1"
          element={
            <ProtectedRoute>
              <EditFacilityFirstStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instalaciones/editar/:id/paso-2"
          element={
            <ProtectedRoute>
              <EditFacilitySecondStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/instalaciones/eliminar/:id"
          element={
            <ProtectedRoute>
              <DeleteFacility />
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
          path="/usuarios/crear/paso-general"
          element={
            <ProtectedRoute>
              <CreateUserFirstStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/crear/paso-especifico-trabajador"
          element={
            <ProtectedRoute>
              <CreateUserWorkerSpecific />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/crear/paso-especifico-atleta"
          element={
            <ProtectedRoute>
              <CreateUserAthleteSpecific />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/editar/:id/paso-1"
          element={
            <ProtectedRoute>
              <EditUserFirstStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/editar/:id/paso-2"
          element={
            <ProtectedRoute>
              <EditUserSecondStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios/eliminar/:id"
          element={
            <ProtectedRoute>
              <DeleteUser />
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
          path="/actividades/crear/paso-1"
          element={
            <ProtectedRoute>
              <CreateActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/actividades/crear/paso-2"
          element={
            <ProtectedRoute>
              <CreateActivitySecondStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/actividades/eliminar/:id"
          element={
            <ProtectedRoute>
              <DeleteActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/actividades/editar/:id"
          element={
            <ProtectedRoute>
              <EditActivityFirstStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/actividades/editar/:id/paso-2"
          element={
            <ProtectedRoute>
              <EditActivitySecondStep />
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
        <Route
          path="/membresias/editar/:id"
          element={
            <ProtectedRoute>
              <EditMembership />
            </ProtectedRoute>
          }
        />
        <Route
          path="/membresias/eliminar/:id"
          element={
            <ProtectedRoute>
              <DeleteMembership />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sincronizar"
          element={
            <ProtectedRoute>
              <Sync />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={token ? '/home' : '/login'} replace />} />
      </Routes>
    </>
  );
}
