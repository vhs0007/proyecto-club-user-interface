import CreateUserWorkerForm from "../../components/users/CreateUserWorkerForm";
import { Link } from "react-router-dom";

export default function CreateUserWorkerSpecific() {
    return (
        <div className="container max-w-7xl mx-auto py-4 px-3 md:py-5 md:px-4">
            <div className="mx-auto w-full max-w-2xl">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="mb-0 text-2xl font-bold tracking-tight text-slate-800">
                        Datos del trabajador
                    </h1>
                    <Link to="/trabajadores/crear/paso-general" className="pageBackButton shrink-0 self-end sm:self-auto">
                        ← Atrás
                    </Link>
                </div>
                <CreateUserWorkerForm />
            </div>
        </div>
    );
}
