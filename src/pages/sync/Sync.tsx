import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SyncBar from "../../components/sync/SyncBar";
import AxiosInstance from "../../config/axios";
import { useMembershipTypeStore } from "../../store/store";
import type { MembershipType } from "../../entities/Entities";

export default function Sync() {
  const navigate = useNavigate();
  const [membershipTypesProgress, setMembershipTypesProgress] = useState<number>(0);
  const [membershipTypes, setMembershipTypesState] = useState<MembershipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setMembershipTypes = useMembershipTypeStore((state) => state.setMembershipTypes);

  useEffect(() => {
    const fetchMembershipTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await AxiosInstance.get<MembershipType[]>("/membership-type");
        const data = response.data ?? [];
        setMembershipTypesState(data);
      } catch (err) {
        setError("Error al cargar los tipos de membresía");
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipTypes();
  }, []);

  useEffect(() => {
    if (loading || membershipTypes.length === 0) {
      if (!loading) setMembershipTypesProgress(100);
      return;
    }
    const total = membershipTypes.length;

    const runSync = async () => {
      for (let i = 0; i < total; i++) {
        await new Promise((r) => setTimeout(r, 1));
        setMembershipTypesProgress(((i + 1) / total) * 1);
      }
      setMembershipTypes(membershipTypes);
      setMembershipTypesProgress(100);
      navigate("/home");
    };

    console.log(membershipTypes);
    console.log(membershipTypesProgress);
    console.log(loading);
    console.log(setMembershipTypes);
    console.log(error);
    console.log(membershipTypes.length);
    runSync();
    navigate('/home');
  }, [loading, membershipTypes, setMembershipTypes]);

  return (
    <div className="container">
      <h1>Sincronización de datos</h1>
      <p>{loading ? "Sincronizando datos..." : "Sincronización completada."}</p>
      {error && <p className="text-danger">{error}</p>}
      <SyncBar progress={membershipTypesProgress} dataName="Tipos de membresía" />
    </div>
  );
}
