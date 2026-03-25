import { useEffect, useState } from 'react';
import type{FacilityResponse} from '../../entities/Entities';
import { useFacilityStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';
export default function FacilitiesList() {
    const [facilitiesList, setFacilitiesList] = useState<FacilityResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate()
    useEffect(() => {
        setLoading(true);
        try {
            setFacilitiesList(useFacilityStore.getState().facilities);
        }
        catch {
            setError('Error al obtener las instalaciones');
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (facilitiesList.length === 0) {
        return <div>
            <button className="btn btn-primary" onClick={() => navigate('/instalaciones/crear/paso-1')}></button>
            No hay instalaciones</div>;
    }

    return (
        <div className="container">
            <h1>Instalaciones</h1>
            <div className="row">
                <div className="col-12">
                    <button className="btn btn-primary" onClick={() => navigate('/instalaciones/crear/paso-1')}>
                        <i className="bi bi-plus"></i>
                    </button>
                </div>
            </div>
            <table className="table table-striped table-hover table-responsive">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Aforo</th>
                        <th>Trabajador Encargado</th>
                        <th>Trabajador Ayudante</th>
                        <th>Activo</th>
                        <th>incluida en:</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {facilitiesList.map((facility) => (
                        <tr key={facility.id}>
                            <td>{facility.id}</td>
                            <td>{facility.type}</td>
                            <td>{facility.capacity}</td>
                            <td>{facility.responsibleWorker.name}</td>
                            <td>{facility.assistantWorker?.name}</td>
                            {facility.capacity ? <td>si</td> : <td>no</td>}
                            <td>{facility.membershipTypes.map((membershipType) => membershipType.name).join(', ')}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => navigate(`/instalaciones/editar/${facility.id}/paso-1`)}>
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => navigate(`/instalaciones/eliminar/${facility.id}`)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}