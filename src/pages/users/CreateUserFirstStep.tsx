import { Link } from "react-router-dom";
import CreateUserFirstStepForm from '../../components/users/CreateUserFirstStepForm';


export default function CreateUserFirstStep() {
  return (
    <div>
      <Link to="/usuarios" className="pageBackButton">
        ← Atrás
      </Link>
      <h1>CREAR USUARIO</h1>
      <CreateUserFirstStepForm />
    </div>
  )
}