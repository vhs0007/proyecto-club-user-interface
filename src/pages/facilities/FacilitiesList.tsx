import { useEffect, useState } from 'react';
import type{FacilityResponse} from '../../entities/Entities';
import { useFacilityStore } from '../../store/store';
import { useNavigate } from 'react-router-dom';
import FacilityList from '../../components/facilities/FacilityList';
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

    return (
        <div className="mx-auto max-w-7xl py-4 px-3 md:py-5 md:px-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-slate-200/90">
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                    Instalaciones
                </h2>

                <button
                    type="button"
                    className="pageHeaderPrimaryButton"
                    onClick={() => navigate('/instalaciones/crear/paso-1')}
                >
                    <i className="bi bi-plus-lg mr-2" />
                    Nueva Instalación
                </button>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70">
                <div className="p-4 md:p-6">
                    {facilitiesList.length === 0 ? (
                        <div className="rounded-md border border-dashed border-slate-200 bg-slate-50/90 py-12 text-center text-sm text-slate-500">
                            No hay instalaciones registradas
                        </div>
                    ) : (
                        <FacilityList
                            facilities={facilitiesList}
                            onEdit={(facility) => navigate(`/instalaciones/editar/${facility.id}/paso-1`)}
                            onDelete={(id) => navigate(`/instalaciones/eliminar/${id}`)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}