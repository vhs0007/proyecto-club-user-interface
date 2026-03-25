import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SyncBar from "../../components/sync/SyncBar";
import AxiosInstance from "../../config/axios";
import { useActivityStore, useFacilityStore, useMembershipStore, useMembershipTypeStore, useUserTypeStore, useUserStore, useClubIdStore } from "../../store/store";
import type { ActivityResponse, FacilityResponse, MembershipResponse, MembershipType, UserType, UserResponse } from "../../entities/Entities";

export default function Sync() {
  const navigate = useNavigate();
  const [membershipTypesProgress, setMembershipTypesProgress] = useState<number>(0);
  const [membershipsProgress, setMembershipsProgress] = useState<number>(0);
  const [activitiesProgress, setActivitiesProgress] = useState<number>(0);
  const [facilitiesProgress, setFacilitiesProgress] = useState<number>(0);
  const [membershipTypes, setMembershipTypesState] = useState<MembershipType[]>([]);
  const [memberships, setMembershipsState] = useState<MembershipResponse[]>([]);
  const [activities, setActivitiesState] = useState<ActivityResponse[]>([]);
  const [facilities, setFacilitiesState] = useState<FacilityResponse[]>([]);
  const [users, setUsersState] = useState<UserResponse[]>([]);
  const [usersProgress, setUsersProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setMembershipTypes = useMembershipTypeStore((state) => state.setMembershipTypes);
  const setMemberships = useMembershipStore((state) => state.setMemberships);
  const setActivities = useActivityStore((state) => state.setActivities);
  const setUserTypes = useUserTypeStore((state) => state.setUserTypes);
  const setFacilities = useFacilityStore((state) => state.setFacilities);
  const setUsers = useUserStore((state) => state.setUsers);
  useEffect(() => {
    const fetchData = async () => {
      try {

        setLoading(true);
        setError(null);
        const clubId = useClubIdStore.getState().clubId;
        const [responseMembershipTypes, responseMemberships, responseActivities, responseUserTypes, responseFacilities, responseUsers] = await Promise.all([
          AxiosInstance.get<MembershipType[]>(`/membership-type?clubId=${clubId}`),
          AxiosInstance.get<MembershipResponse[]>(`/membership?clubId=${clubId}`),
          AxiosInstance.get<ActivityResponse[]>(`/activities?clubId=${clubId}`),
          AxiosInstance.get<UserType[]>(`/user-type?clubId=${clubId}`),
          AxiosInstance.get<FacilityResponse[]>(`/facilities?clubId=${clubId}`),
          AxiosInstance.get<UserResponse[]>(`/users?clubId=${clubId}`),
        ]);

        const dataMembershipTypes = responseMembershipTypes.data ?? [];
        const dataMemberships = responseMemberships.data ?? [];
        const dataActivities = responseActivities.data ?? [];
        const dataUserTypes = responseUserTypes?.data ?? [];
        const dataFacilities = responseFacilities.data ?? [];
        const dataUsers = responseUsers.data ?? [];
        console.log("data de membership types", dataMembershipTypes);
        console.log("data de memberships", dataMemberships);
        console.log("data de activities", dataActivities);
        console.log("data de facilities", dataFacilities);
        console.log("data de Activities", dataActivities);
        console.log("data de users", dataUsers);

        setMembershipTypesState(dataMembershipTypes);
        setMembershipsState(dataMemberships);
        setActivitiesState(dataActivities);
        setMembershipTypes(dataMembershipTypes);
        setMemberships(dataMemberships);
        setActivities(dataActivities);
        setUserTypes(dataUserTypes);
        setFacilitiesState(dataFacilities);
        setUsersState(dataUsers);
      } catch (err) {
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setMembershipTypes, setMemberships, setActivities, setUserTypes, setFacilities, setUsers]);

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

  const runSyncMemberships = async (totalMemberships: number, memberships: MembershipResponse[]) => {
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

  const runSyncActivities = async (totalActivities: number, activitiesData: ActivityResponse[]) => {
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

  const runSyncFacilities = async (totalFacilities: number, facilitiesData: FacilityResponse[]) => {
    if (totalFacilities === 0) {
      setFacilities([]);
      setFacilitiesProgress(100);
      return;
    }
    for (let i = 0; i < totalFacilities; i++) {
      await new Promise((r) => setTimeout(r, 1));
      setFacilitiesProgress(((i + 1) / totalFacilities) * 100);
    }
    setFacilities(facilitiesData);
    setFacilitiesProgress(100);
  };

  const runSyncUsers = async (totalUsers: number, usersData: UserResponse[]) => {
    if (totalUsers === 0) {
      setUsers([]);
      setUsersProgress(100);
      return;
    }
    for (let i = 0; i < totalUsers; i++) {
      await new Promise((r) => setTimeout(r, 1));
      setUsersProgress(((i + 1) / totalUsers) * 100);
    }
    setUsers(usersData);
    setUsersProgress(100);
  }

  useEffect(() => {
    if (loading) return;
    const totalMembershipTypes = membershipTypes.length;
    const totalMemberships = memberships.length;
    const totalActivities = activities.length;
    const totalFacilities = facilities.length;
    const totalUsers = users.length;
    const runSync = async () => {
      await runSyncMembershipTypes(totalMembershipTypes, membershipTypes);
      await runSyncMemberships(totalMemberships, memberships);
      await runSyncActivities(totalActivities, activities);
      await runSyncFacilities(totalFacilities, facilities);
      await runSyncUsers(totalUsers, users);
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
  }, [loading, membershipTypes, memberships, activities, facilities, setMembershipTypes, setMemberships, setActivities, setFacilities, navigate, users, setUsers]);

  return (
    <div className="container">
      <h1>Sincronización de datos</h1>
      <p>{loading ? "Sincronizando datos..." : "Sincronización completada."}</p>
      {error && <p className="text-danger">{error}</p>}
      <SyncBar progress={membershipTypesProgress} dataName="Tipos de membresía" />
      <SyncBar progress={membershipsProgress} dataName="Membresías" />
      <SyncBar progress={activitiesProgress} dataName="Actividades" />
      <SyncBar progress={facilitiesProgress} dataName="Instalaciones" />
      <SyncBar progress={usersProgress} dataName="Usuarios" />
    </div>
  );
}
