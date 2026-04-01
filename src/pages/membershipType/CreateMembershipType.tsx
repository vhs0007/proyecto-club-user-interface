import { Link } from 'react-router-dom';
import CreateMembershipTypeForm from '../../components/membershipType/CreateMembershipTypeForm';

export default function CreateMembershipType() {
  return (
    <div className="mx-auto max-w-7xl py-4 px-3 md:py-5 md:px-4">
      <Link to="/tipos-membresia" className="pageBackButton mb-3">
        ← Atrás
      </Link>
      <h1 className="mb-6 text-2xl font-bold tracking-tight text-slate-800">Crear tipo de membresía</h1>
      <CreateMembershipTypeForm />
    </div>
  );
}
