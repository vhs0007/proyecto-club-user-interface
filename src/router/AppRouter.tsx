import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/store';
import Login from '../pages/login/Login';
import Home from '../pages/home/Home';
import FacilitiesList from '../pages/facilities/FacilitiesList';
import WorkerList from '../pages/users/WorkerList';
import MemberList from '../pages/users/MemberList';
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
import EditWorkerFirstStep from '../pages/users/EditWorkerFirstStep';
import EditMemberFirstStep from '../pages/users/EditMemberFirstStep';
import EditUserWorkerSpecific from '../pages/users/EditUserWorkerSpecific';
import EditUserAthleteSpecific from '../pages/users/EditUserAthleteSpecific';
import DeleteUser from '../pages/users/DeleteUser';
import DeleteActivity from '../pages/activities/DeleteActivity';
import CreateWorkerFirstStep from '../pages/users/CreateWorkerFirstStep';
import Reports from '../pages/reports/Reports';
import ReportSalaryStep from '../pages/reports/ReportSalaryStep';
import SalaryReportPage from '../pages/reports/SalaryReportPage';
import NewUsersReportPage from '../pages/reports/NewUsersReportPage';
import EditActivityFirstStep from '../pages/activities/EditActivityFirstStep';
import EditActivitySecondStep from '../pages/activities/EditActivitySecondStep';
import MembershipTypes from '../pages/membershipType/MembershipTypes';
import CreateMembershipType from '../pages/membershipType/CreateMembershipType';
import EditMembershipType from '../pages/membershipType/EditMembershipType';
import DeleteMembershipType from '../pages/membershipType/DeleteMembershipType';
import CreateMemberFirstStep from '../pages/users/CreateMemberFirstStep';

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
          path="/trabajadores"
          element={
            <ProtectedRoute>
              <WorkerList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trabajadores/crear/paso-general"
          element={
            <ProtectedRoute>
              <CreateWorkerFirstStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trabajadores/crear/paso-especifico-trabajador"
          element={
            <ProtectedRoute>
              <CreateUserWorkerSpecific />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trabajadores/crear/paso-especifico-atleta"
          element={
            <ProtectedRoute>
              <CreateUserAthleteSpecific />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trabajadores/editar/:id/paso-1"
          element={
            <ProtectedRoute>
              <EditWorkerFirstStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trabajadores/editar/:id/paso-especifico-trabajador"
          element={
            <ProtectedRoute>
              <EditUserWorkerSpecific />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trabajadores/editar/:id/paso-especifico-atleta"
          element={
            <ProtectedRoute>
              <EditUserAthleteSpecific />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trabajadores/eliminar/:id"
          element={
            <ProtectedRoute>
              <DeleteUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/miembros"
          element={
            <ProtectedRoute>
              <MemberList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/miembros/crear/paso-general"
          element={
            <ProtectedRoute>
              <CreateMemberFirstStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/miembros/crear/paso-especifico-atleta"
          element={
            <ProtectedRoute>
              <CreateUserAthleteSpecific />
            </ProtectedRoute>
          }
        />
        <Route
          path="/miembros/editar/:id/:typeId/paso-1"
          element={
            <ProtectedRoute>
              <EditMemberFirstStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/miembros/editar/:id/paso-especifico-atleta"
          element={
            <ProtectedRoute>
              <EditUserAthleteSpecific />
            </ProtectedRoute>
          }
        />
        <Route
          path="/miembros/eliminar/:id/:typeId"
          element={
            <ProtectedRoute>
              <DeleteUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservas"
          element={
            <ProtectedRoute>
              <Activities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservas/crear/paso-1"
          element={
            <ProtectedRoute>
              <CreateActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservas/crear/paso-2"
          element={
            <ProtectedRoute>
              <CreateActivitySecondStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservas/eliminar/:id"
          element={
            <ProtectedRoute>
              <DeleteActivity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservas/editar/:id"
          element={
            <ProtectedRoute>
              <EditActivityFirstStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservas/editar/:id/paso-2"
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
          path="/tipos-membresia"
          element={
            <ProtectedRoute>
              <MembershipTypes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipos-membresia/crear"
          element={
            <ProtectedRoute>
              <CreateMembershipType />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipos-membresia/editar/:id"
          element={
            <ProtectedRoute>
              <EditMembershipType />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipos-membresia/eliminar/:id"
          element={
            <ProtectedRoute>
              <DeleteMembershipType />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes/salario/paso-1"
          element={
            <ProtectedRoute>
              <ReportSalaryStep />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes/salario/:id"
          element={
            <ProtectedRoute>
              <SalaryReportPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes/nuevos-usuarios"
          element={
            <ProtectedRoute>
              <NewUsersReportPage />
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
