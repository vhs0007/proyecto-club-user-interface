import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SyncBar from "../../components/sync/SyncBar";
import AxiosInstance from "../../config/axios";
import { useMembershipStore, useMembershipTypeStore } from "../../store/store";
import type { MembershipType } from "../../entities/Entities";
import type { Membership } from "../../entities/Entities";

export default function Sync() {
  const navigate = useNavigate();
  const [membershipTypesProgress, setMembershipTypesProgress] = useState<number>(0);
  const [membershipsProgress, setMembershipsProgress] = useState<number>(0);
  const [membershipTypes, setMembershipTypesState] = useState<MembershipType[]>([]);
  const [memberships, setMembershipsState] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setMembershipTypes = useMembershipTypeStore((state) => state.setMembershipTypes);
  const setMemberships = useMembershipStore((state) => state.setMemberships);
  useEffect(() => {
    const fetchMembershipTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const responseMembershipTypes = await AxiosInstance.get<MembershipType[]>("/membership-type");
        const responseMemberships = await AxiosInstance.get<Membership[]>("/membership");
        const dataMembershipTypes = responseMembershipTypes.data ?? [];
        const dataMemberships = responseMemberships.data ?? [];
        setMembershipTypesState(dataMembershipTypes);
        setMembershipsState(dataMemberships);
        setMembershipTypes(dataMembershipTypes);
        setMemberships(dataMemberships);
      } catch (err) {
        setError("Error al cargar los tipos de membresía");
        setError("Error al cargar las membresías");
      } finally {
        setLoading(false);
        setLoading(false);
      }
    };

    fetchMembershipTypes();
  }, []);

  const runSyncMembershipTypes = async (totalMembershipTypes: number, membershipTypes: MembershipType[]) => {
    for (let i = 0; i < totalMembershipTypes; i++) {
      await new Promise((r) => setTimeout(r, 1));
      setMembershipTypesProgress(((i + 1) / totalMembershipTypes) * 1);
    }
    setMembershipTypes(membershipTypes);
    setMembershipTypesProgress(100);
  };

  const runSyncMemberships = async (totalMemberships: number, memberships: Membership[]) => {
    for (let i = 0; i < totalMemberships; i++) {
      await new Promise((r) => setTimeout(r, 1));
      setMembershipsProgress(((i + 1) / totalMemberships) * 1);
    }
    setMemberships(memberships);
    setMembershipsProgress(100);
  };

  useEffect(() => {
    if (loading || membershipTypes.length === 0) {
      if (!loading) setMembershipTypesProgress(100);
      return;
    }
    const totalMembershipTypes = membershipTypes.length;
    const totalMemberships = memberships.length;
    const runSync = async () => {
      await runSyncMembershipTypes(totalMembershipTypes, membershipTypes);
      await runSyncMemberships(totalMemberships, memberships);
      navigate('/home');
    }
    console.log(membershipTypes);
    console.log(membershipTypesProgress);
    console.log(loading);
    console.log(setMembershipTypes);
    console.log(error);
    console.log(membershipTypes.length);
    console.log(memberships.length);
    console.log(membershipTypes);
    console.log(memberships);
    runSync();
  }, [loading, membershipTypes, memberships, setMembershipTypes, setMemberships]);

  return (
    <div className="container">
      <h1>Sincronización de datos</h1>
      <p>{loading ? "Sincronizando datos..." : "Sincronización completada."}</p>
      {error && <p className="text-danger">{error}</p>}
      <SyncBar progress={membershipTypesProgress} dataName="Tipos de membresía" />
      <SyncBar progress={membershipsProgress} dataName="Membresías" />
    </div>
  );
}
