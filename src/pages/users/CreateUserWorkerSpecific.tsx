import CreateUserWorkerForm from "../../components/users/CreateUserWorkerForm";
import { Link } from "react-router-dom";

export default function CreateUserWorkerSpecific() {
    return (
        <div className="container py-4">
            <Link to="/usuarios" className="pageBackButton mb-3">
                ← Atrás
            </Link>
            <h1 className="mb-4">Datos del trabajador</h1>
            <CreateUserWorkerForm />
        </div>
    );
}
