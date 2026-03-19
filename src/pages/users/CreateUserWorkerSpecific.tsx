import CreateUserWorkerForm from "../../components/users/CreateUserWorkerForm";

export default function CreateUserWorkerSpecific() {
    return (
        <div className="container py-4">
            <h1 className="mb-4">Datos del trabajador</h1>
            <CreateUserWorkerForm />
        </div>
    );
}
