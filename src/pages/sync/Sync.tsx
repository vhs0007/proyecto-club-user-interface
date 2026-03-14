import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SyncBar from "../../components/sync/SyncBar";
import AxiosInstance from "../../config/axios";
import { useActivityStore, useMembershipStore, useMembershipTypeStore } from "../../store/store";
import type { Activity, Membership, MembershipType } from "../../entities/Entities";

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [responseMembershipTypes, responseMemberships, responseActivities] = await Promise.all([
          AxiosInstance.get<MembershipType[]>("/membership-type"),
          AxiosInstance.get<Membership[]>("/membership"),
          AxiosInstance.get<Activity[]>("/activities"),
        ]);
        const dataMembershipTypes = responseMembershipTypes.data ?? [];
        const dataMemberships = responseMemberships.data ?? [];
        const dataActivities = responseActivities.data ?? [];

        console.log("data de membership types", dataMembershipTypes);
        console.log("data de memberships", dataMemberships);
        console.log("data de activities", dataActivities);

        setMembershipTypesState(dataMembershipTypes);
        setMembershipsState(dataMemberships);
        setActivitiesState(dataActivities);
        setMembershipTypes(dataMembershipTypes);
        setMemberships(dataMemberships);
        setActivities(dataActivities);
      } catch (err) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setMembershipTypes, setMemberships, setActivities]);

  const runSyncMembershipTypes = async (totalMembershipTypes: number, membershipTypes: MembershipType[]) => {
    console.log(totalMembershipTypes);
    console.log(membershipTypes);
    if (totalMembershipTypes === 0) {
      setMembershipTypes([]);
      setMembershipTypesProgress(100);
      return;
    }
    for (let i = 0; i < totalMembershipTypes; i++) {
      await new Promise((r) => setTimeout(r, 1));
      setMembershipTypesProgress(((i + 1) / totalMembershipTypes) * 1);
    }
    setMembershipTypes(membershipTypes);
    setMembershipTypesProgress(100);
  };

  const runSyncMemberships = async (totalMemberships: number, memberships: Membership[]) => {
    if (totalMemberships === 0) {
      setMemberships([]);
      setMembershipsProgress(100);
      return;
    }
    for (let i = 0; i < totalMemberships; i++) {
      await new Promise((r) => setTimeout(r, 1));
      setMembershipsProgress(((i + 1) / totalMemberships) * 1);
    }
    setMemberships(memberships);
    setMembershipsProgress(100);
  };

  const runSyncActivities = async (totalActivities: number, activitiesData: Activity[]) => {
    const total = totalActivities || 1;
    if (totalActivities === 0) {
      setActivities([]);
      setActivitiesProgress(100);
      return;
    }
    for (let i = 0; i < total; i++) {
      await new Promise((r) => setTimeout(r, 1));
      setActivitiesProgress(((i + 1) / total) * 100);
    }
    setActivities(activitiesData);
    setActivitiesProgress(100);
  };

  useEffect(() => {
    if (loading) return;
    const totalMembershipTypes = membershipTypes.length;
    const totalMemberships = memberships.length;
    const totalActivities = activities.length;
    const runSync = async () => {
      await runSyncMembershipTypes(totalMembershipTypes, membershipTypes);
      await runSyncMemberships(totalMemberships, memberships);
      await runSyncActivities(totalActivities, activities);
      navigate('/home');
    }
    console.log("membership types", membershipTypes);
    console.log("membership types progress", membershipTypesProgress);
    console.log("loading", loading);
    console.log("setMembershipTypes", setMembershipTypes);
    console.log("error", error);
    console.log("membership types length", membershipTypes.length);
    console.log("memberships length", memberships.length);
    console.log("activities length", activities.length);
    console.log("activities", activities);
    console.log("activities progress", activitiesProgress);
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
