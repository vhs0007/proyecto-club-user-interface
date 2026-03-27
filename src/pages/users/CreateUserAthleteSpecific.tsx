import CreateUserAthleteForm from "../../components/users/CreateUserAthleteForm";
import { Link } from "react-router-dom";

export default function CreateUserAthleteSpecific() {
    return (
        <div className="container py-4">
            <Link to="/usuarios" className="pageBackButton mb-3">
                ← Atrás
            </Link>
            <h1 className="mb-4">Datos del atleta</h1>
            <CreateUserAthleteForm />
        </div>
    );
}
