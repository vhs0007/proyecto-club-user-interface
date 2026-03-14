import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SyncBar from "../../components/sync/SyncBar";
import AxiosInstance from "../../config/axios";
import { useActivityStore, useMembershipStore, useMembershipTypeStore, useUserTypeStore } from "../../store/store";
import type { Activity, Membership, MembershipType, UserType } from "../../entities/Entities";

export default function Sync() {
  const navigate = useNavigate();
  const [membershipTypesProgress, setMembershipTypesProgress] = useState<number>(0);
  const [membershipsProgress, setMembershipsProgress] = useState<number>(0);
  const [activitiesProgress, setActivitiesProgress] = useState<number>(0);
  const [membershipTypes, setMembershipTypesState] = useState<MembershipType[]>([]);
  const [memberships, setMembershipsState] = useState<Membership[]>([]);
  const [activities, setActivitiesState] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setMembershipTypes = useMembershipTypeStore((state) => state.setMembershipTypes);
  const setMemberships = useMembershipStore((state) => state.setMemberships);
  const setActivities = useActivityStore((state) => state.setActivities);
  const setUserTypes = useUserTypeStore((state) => state.setUserTypes);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [responseMembershipTypes, responseMemberships, responseActivities, responseUserTypes] = await Promise.all([
          AxiosInstance.get<MembershipType[]>("/membership-type"),
          AxiosInstance.get<Membership[]>("/membership"),
          AxiosInstance.get<Activity[]>("/activities"),
          AxiosInstance.get<UserType[]>("/user-type"),
        ]);
        const dataMembershipTypes = responseMembershipTypes.data ?? [];
        const dataMemberships = responseMemberships.data ?? [];
        const dataActivities = responseActivities.data ?? [];
        const dataUserTypes = responseUserTypes?.data ?? [];
        setMembershipTypesState(dataMembershipTypes);
        setMembershipsState(dataMemberships);
        setActivitiesState(dataActivities);
        setMembershipTypes(dataMembershipTypes);
        setMemberships(dataMemberships);
        setActivities(dataActivities);
        setUserTypes(dataUserTypes);
      } catch (err) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setMembershipTypes, setMemberships, setActivities, setUserTypes]);

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

  const runSyncActivities = async (totalActivities: number, activitiesData: Activity[]) => {
    const total = totalActivities || 1;
    for (let i = 0; i < total; i++) {
      await new Promise((r) => setTimeout(r, 1));
      setActivitiesProgress(((i + 1) / total) * 100);
    }
    setActivities(activitiesData);
    setActivitiesProgress(100);
  };

  useEffect(() => {
    if (loading || membershipTypes.length === 0) {
      if (!loading) setMembershipTypesProgress(100);
      if (!loading) setActivitiesProgress(100);
      return;
    }
    const totalMembershipTypes = membershipTypes.length;
    const totalMemberships = memberships.length;
    const totalActivities = activities.length;
    const runSync = async () => {
      await runSyncMembershipTypes(totalMembershipTypes, membershipTypes);
      await runSyncMemberships(totalMemberships, memberships);
      await runSyncActivities(totalActivities, activities);
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
    console.log(activities);
    console.log(activitiesProgress);
    runSync();
  }, [loading, membershipTypes, memberships, activities, setMembershipTypes, setMemberships, setActivities]);

  return (
    <div className="container">
      <h1>Sincronización de datos</h1>
      <p>{loading ? "Sincronizando datos..." : "Sincronización completada."}</p>
      {error && <p className="text-danger">{error}</p>}
      <SyncBar progress={membershipTypesProgress} dataName="Tipos de membresía" />
      <SyncBar progress={membershipsProgress} dataName="Membresías" />
      <SyncBar progress={activitiesProgress} dataName="Actividades" />
    </div>
  );
}
