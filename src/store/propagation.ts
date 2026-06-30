import type {
  ActivityResponse,
  ActivitiesNavigation,
  FacilityNavigation,
  FacilityResponse,
  FacilityWorkerResponse,
  MembershipResponse,
  MembershipType,
  MembershipTypeNavigation,
  ScheduledActivityNavigation,
  ScheduledActivityResponse,
  UserNavigation,
  UserResponse,
  WorkerNavigation,
} from '../entities/Entities';
import {
  useActivityStore,
  useFacilityStore,
  useMembershipStore,
  useScheduledActivityStore,
  useUserStore,
} from './store';

// --- Helpers de proyección ---

export function toMembershipTypeNavigation(mt: MembershipType): MembershipTypeNavigation {
  return { id: mt.id, clubId: mt.clubId, name: mt.name, price: mt.price };
}

function toUserTypeNavigation(user: UserResponse): { id: number; name: string } {
  return user.type
    ? { id: user.type.id, name: user.type.name }
    : { id: user.typeId, name: '' };
}

export function toUserNavigation(user: UserResponse): UserNavigation {
  return {
    id: user.id,
    clubId: user.clubId,
    name: user.name,
    type: toUserTypeNavigation(user),
    typeId: user.typeId,
    email: user.email ?? null,
    createdAt: user.createdAt ?? new Date(),
    deletedAt: user.deletedAt ?? null,
    isActive: user.isActive,
  };
}

export function toWorkerNavigation(user: UserResponse): WorkerNavigation {
  return {
    id: user.id,
    clubId: user.clubId,
    name: user.name,
    type: toUserTypeNavigation(user),
    email: user.email ?? null,
    password: user.password ?? null,
    createdAt: user.createdAt ?? new Date(),
    deletedAt: user.deletedAt ?? null,
    isActive: user.isActive,
  };
}

function toFacilityNavigation(facility: FacilityResponse): FacilityNavigation {
  return {
    id: facility.id,
    clubId: facility.clubId,
    type: facility.type,
    capacity: facility.capacity,
    responsibleWorker: facility.responsibleWorker,
    assistantWorkers: facility.assistantWorkers,
    isActive: facility.isActive,
  };
}

function toActivitiesNavigation(activity: ActivityResponse): ActivitiesNavigation {
  return {
    id: activity.id,
    clubId: activity.clubId,
    name: activity.name,
    type: activity.type,
    date: activity.date,
    hourStart: activity.hourStart,
    hourEnd: activity.hourEnd,
    user: activity.user,
    cost: activity.cost,
    state: activity.state,
  };
}

function toScheduledActivityNavigation(sa: ScheduledActivityResponse): ScheduledActivityNavigation {
  return {
    id: sa.id,
    clubId: sa.clubId,
    membershipTypes: sa.membershipTypes,
    responsibleWorker: sa.user,
    assistantWorkers: sa.assistantWorkers,
    datetimeScheduledActivities: sa.datetimeScheduledActivities,
  };
}

function replaceUserNavigation(existing: UserNavigation, user: UserResponse): UserNavigation {
  if (existing.id !== user.id) return existing;
  return toUserNavigation(user);
}

function replaceWorkerNavigation(existing: WorkerNavigation, user: UserResponse): WorkerNavigation {
  if (existing.id !== user.id) return existing;
  return toWorkerNavigation(user);
}

// --- Fase 1: MembershipType ---

export function propagateMembershipTypeUpdate(membershipType: MembershipType): void {
  const nav = toMembershipTypeNavigation(membershipType);

  const facilities = useFacilityStore.getState().facilities.map((f) => ({
    ...f,
    membershipTypes: f.membershipTypes.map((mt) => (mt.id === membershipType.id ? nav : mt)),
  }));
  useFacilityStore.getState().setFacilities(facilities);

  const scheduledActivities = useScheduledActivityStore.getState().scheduledActivities.map((sa) => ({
    ...sa,
    membershipTypes: sa.membershipTypes.map((mt) => (mt.id === membershipType.id ? nav : mt)),
  }));
  useScheduledActivityStore.getState().setScheduledActivities(scheduledActivities);

  const memberships = useMembershipStore.getState().memberships.map((m) =>
    m.membershipType.id === membershipType.id ? { ...m, membershipType } : m,
  );
  useMembershipStore.getState().setMemberships(memberships);

  const users = useUserStore.getState().users.map((u) => {
    if (u.membership?.membershipType?.id !== membershipType.id) return u;
    return {
      ...u,
      membership: { ...u.membership, membershipType },
    };
  });
  useUserStore.getState().setUsers(users);
}

export function propagateMembershipTypeDelete(id: number): void {
  const facilities = useFacilityStore.getState().facilities.map((f) => ({
    ...f,
    membershipTypes: f.membershipTypes.filter((mt) => mt.id !== id),
  }));
  useFacilityStore.getState().setFacilities(facilities);

  const scheduledActivities = useScheduledActivityStore.getState().scheduledActivities.map((sa) => ({
    ...sa,
    membershipTypes: sa.membershipTypes.filter((mt) => mt.id !== id),
  }));
  useScheduledActivityStore.getState().setScheduledActivities(scheduledActivities);

  const memberships = useMembershipStore.getState().memberships.filter(
    (m) => m.membershipType.id !== id,
  );
  useMembershipStore.getState().setMemberships(memberships);

  const users = useUserStore.getState().users.map((u) => {
    if (u.membership?.membershipType?.id !== id) return u;
    const { membership: _removed, ...rest } = u;
    return rest as UserResponse;
  });
  useUserStore.getState().setUsers(users);
}

// --- Fase 2: Membership ---

export function propagateMembershipToUser(membership: MembershipResponse): void {
  const userStore = useUserStore.getState();
  const user = userStore.getUser(membership.user.id, membership.user.typeId);
  if (!user) return;

  userStore.updateUser({
    ...user,
    membership: {
      id: membership.id,
      expiration: membership.expiration,
      createdAt: membership.createdAt,
      membershipType: membership.membershipType,
    },
  });
}

export function propagateMembershipDelete(membership: MembershipResponse): void {
  const userStore = useUserStore.getState();
  const user = userStore.getUser(membership.user.id, membership.user.typeId);
  if (!user?.membership || user.membership.id !== membership.id) return;

  const { membership: _removed, ...rest } = user;
  userStore.setUsers(
    userStore.users.map((u) =>
      u.id === user.id && u.typeId === user.typeId ? (rest as UserResponse) : u,
    ),
  );
}

// --- Fase 3: User (trabajador) ---

export function propagateWorkerUpdate(user: UserResponse): void {
  const userNav = toUserNavigation(user);

  const facilities = useFacilityStore.getState().facilities.map((f) => ({
    ...f,
    responsibleWorker:
      f.responsibleWorker?.id === user.id
        ? replaceWorkerNavigation(f.responsibleWorker, user)
        : f.responsibleWorker,
    assistantWorkers: f.assistantWorkers?.map((w) =>
      w.id === user.id ? replaceWorkerNavigation(w, user) : w,
    ) ?? null,
  }));
  useFacilityStore.getState().setFacilities(facilities);

  const activities = useActivityStore.getState().activities.map((a) => ({
    ...a,
    user: replaceUserNavigation(a.user, user),
  }));
  useActivityStore.getState().setActivities(activities);

  const scheduledActivities = useScheduledActivityStore.getState().scheduledActivities.map((sa) => ({
    ...sa,
    user: sa.user?.id === user.id ? userNav : sa.user,
    assistantWorkers: sa.assistantWorkers?.map((w) =>
      w.id === user.id ? userNav : w,
    ) ?? [],
  }));
  useScheduledActivityStore.getState().setScheduledActivities(scheduledActivities);
}

export function propagateWorkerSoftDelete(user: UserResponse): void {
  propagateWorkerUpdate(user);

  const facilities = useFacilityStore.getState().facilities.map((f) => ({
    ...f,
    assistantWorkers: f.assistantWorkers?.filter((w) => w.id !== user.id) ?? null,
  }));
  useFacilityStore.getState().setFacilities(facilities);
}

export function propagateWorkerFacilitiesAssign(response: FacilityWorkerResponse): void {
  const userStore = useUserStore.getState();
  const worker = userStore.getUser(
    response.userNavigation.id,
    response.userNavigation.typeId ?? 1,
  );
  if (!worker) return;

  const facilityStore = useFacilityStore.getState();
  const updatedFacilities = facilityStore.facilities.map((f) => {
    const nav = response.facilityNavigation.find((n) => n.id === f.id);
    if (!nav) return f;
    return {
      ...f,
      assistantWorkers: nav.assistantWorkers,
    };
  });
  facilityStore.setFacilities(updatedFacilities);

  userStore.setUsers(
    userStore.users.map((u) =>
      u.id === worker.id && u.typeId === worker.typeId
        ? {
            ...u,
            facilities: response.facilityNavigation.map((nav) => ({
              ...nav,
              clubId: response.clubId,
            })),
          }
        : u,
    ),
  );
}

// --- Fase 4: User (socio/atleta) ---

export function propagateMemberUpdate(user: UserResponse): void {
  const memberships = useMembershipStore.getState().memberships.map((m) =>
    m.user.id === user.id && m.user.typeId === user.typeId ? { ...m, user } : m,
  );
  useMembershipStore.getState().setMemberships(memberships);
}

export function propagateMemberSoftDelete(user: UserResponse): void {
  propagateMemberUpdate(user);
}

function propagateUserChange(user: UserResponse): void {
  if (user.typeId === 1) {
    if (!user.isActive) {
      propagateWorkerSoftDelete(user);
    } else {
      propagateWorkerUpdate(user);
    }
  } else if (user.typeId === 2 || user.typeId === 3) {
    if (!user.isActive) {
      propagateMemberSoftDelete(user);
    } else {
      propagateMemberUpdate(user);
    }
  }
}

// --- Fase 5: Facility ---

function workerIdsFromFacility(facility: FacilityResponse): number[] {
  const ids = new Set<number>();
  if (facility.responsibleWorker?.id) ids.add(facility.responsibleWorker.id);
  facility.assistantWorkers?.forEach((w) => ids.add(w.id));
  return [...ids];
}

export function propagateFacilityCreate(facility: FacilityResponse): void {
  propagateFacilityUpdate(facility);
}

export function propagateFacilityUpdate(facility: FacilityResponse): void {
  const facilityNav = toFacilityNavigation(facility);
  const workerIds = workerIdsFromFacility(facility);

  const users = useUserStore.getState().users.map((u) => {
    if (u.typeId !== 1 || !workerIds.includes(u.id)) return u;
    const existing = u.facilities ?? [];
    const hasFacility = existing.some((f) => f.id === facility.id);
    const facilities = hasFacility
      ? existing.map((f) => (f.id === facility.id ? facilityNav : f))
      : [...existing, facilityNav];
    return { ...u, facilities };
  });
  useUserStore.getState().setUsers(users);

  const activities = useActivityStore.getState().activities.map((a) =>
    a.facility?.id === facility.id ? { ...a, facility: facilityNav } : a,
  );
  useActivityStore.getState().setActivities(activities);

  const scheduledActivities = useScheduledActivityStore.getState().scheduledActivities.map((sa) =>
    sa.facility?.id === facility.id ? { ...sa, facility: facilityNav } : sa,
  );
  useScheduledActivityStore.getState().setScheduledActivities(scheduledActivities);
}

export function propagateFacilityDelete(facilityId: number): void {
  const scheduledAtFacility = useScheduledActivityStore
    .getState()
    .scheduledActivities.filter((sa) => sa.facility?.id === facilityId);
  const scheduledIds = new Set(scheduledAtFacility.map((sa) => sa.id));

  const users = useUserStore.getState().users.map((u) => ({
    ...u,
    facilities: u.facilities?.filter((f) => f.id !== facilityId),
    scheduleActivities:
      u.scheduleActivities?.filter((s) => !scheduledIds.has(s.id)) ?? null,
  }));
  useUserStore.getState().setUsers(users);

  const activities = useActivityStore.getState().activities.filter(
    (a) => a.facility?.id !== facilityId,
  );
  useActivityStore.getState().setActivities(activities);

  const scheduledActivities = useScheduledActivityStore.getState().scheduledActivities.filter(
    (sa) => sa.facility?.id !== facilityId,
  );
  useScheduledActivityStore.getState().setScheduledActivities(scheduledActivities);
}

// --- Fase 6: Activity ---

export function propagateActivityCreate(activity: ActivityResponse): void {
  propagateActivityUpdate(activity);
}

export function propagateActivityUpdate(
  activity: ActivityResponse,
  previousFacilityId?: number,
): void {
  const activityNav = toActivitiesNavigation(activity);
  const facilityStore = useFacilityStore.getState();

  let facilities = facilityStore.facilities;

  if (previousFacilityId && previousFacilityId !== activity.facility?.id) {
    facilities = facilities.map((f) =>
      f.id === previousFacilityId
        ? { ...f, activities: f.activities.filter((a) => a.id !== activity.id) }
        : f,
    );
  }

  facilities = facilities.map((f) => {
    if (f.id !== activity.facility?.id) return f;
    const exists = f.activities.some((a) => a.id === activity.id);
    const activities = exists
      ? f.activities.map((a) => (a.id === activity.id ? activityNav : a))
      : [...f.activities, activityNav];
    return { ...f, activities };
  });

  facilityStore.setFacilities(facilities);
}

export function propagateActivityDelete(activityId: number, facilityId?: number): void {
  if (!facilityId) {
    const activity = useActivityStore.getState().getActivity(activityId);
    facilityId = activity?.facility?.id;
  }
  if (!facilityId) return;

  const facilities = useFacilityStore.getState().facilities.map((f) =>
    f.id === facilityId
      ? { ...f, activities: f.activities.filter((a) => a.id !== activityId) }
      : f,
  );
  useFacilityStore.getState().setFacilities(facilities);
}

// --- Fase 7: ScheduledActivity ---

function scheduledActivityWorkerIds(sa: ScheduledActivityResponse): number[] {
  const ids = new Set<number>();
  if (sa.user?.id) ids.add(sa.user.id);
  sa.assistantWorkers?.forEach((w) => ids.add(w.id));
  return [...ids];
}

export function propagateScheduledActivityCreate(sa: ScheduledActivityResponse): void {
  propagateScheduledActivityUpdate(sa);
}

export function propagateScheduledActivityUpdate(sa: ScheduledActivityResponse): void {
  const saNav = toScheduledActivityNavigation(sa);
  const workerIds = scheduledActivityWorkerIds(sa);

  const facilities = useFacilityStore.getState().facilities.map((f) => {
    if (f.id !== sa.facility?.id) return f;
    const existing = f.scheduleActivities ?? [];
    const hasSa = existing.some((s) => s.id === sa.id);
    const scheduleActivities = hasSa
      ? existing.map((s) => (s.id === sa.id ? saNav : s))
      : [...existing, saNav];
    return { ...f, scheduleActivities };
  });
  useFacilityStore.getState().setFacilities(facilities);

  const users = useUserStore.getState().users.map((u) => {
    if (u.typeId !== 1 || !workerIds.includes(u.id)) return u;
    const existing = u.scheduleActivities ?? [];
    const hasSa = existing.some((s) => s.id === sa.id);
    const scheduleActivities = hasSa
      ? existing.map((s) => (s.id === sa.id ? saNav : s))
      : [...existing, saNav];
    return { ...u, scheduleActivities };
  });
  useUserStore.getState().setUsers(users);
}

export function propagateScheduledActivityDelete(scheduledActivityId: number): void {
  const facilities = useFacilityStore.getState().facilities.map((f) => ({
    ...f,
    scheduleActivities: f.scheduleActivities?.filter((s) => s.id !== scheduledActivityId),
  }));
  useFacilityStore.getState().setFacilities(facilities);

  const users = useUserStore.getState().users.map((u) => ({
    ...u,
    scheduleActivities: u.scheduleActivities?.filter((s) => s.id !== scheduledActivityId) ?? null,
  }));
  useUserStore.getState().setUsers(users);
}

export { propagateUserChange };
