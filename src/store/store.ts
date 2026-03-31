import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MembershipResponse, MembershipType, UserType, UserResponse } from '../entities/Entities';
import type { FacilityResponse } from '../entities/Entities';
import type { ActivityResponse } from '../entities/Entities';


interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

interface ClubIdState{
  clubId: number;
  setClubId: (clubId: number) => void;
}


interface MembershipTypeState {
  membershipTypes: MembershipType[];
  setMembershipTypes: (membershipTypes: MembershipType[]) => void;
  setMembershipType: (membershipType: MembershipType) => void;
  deleteMembershipType: (id: number) => void;
  getMembershipType: (id: number) => MembershipType | null;
  updateMembershipType: (membershipType: MembershipType) => void;
}

interface UserTypeState {
  userTypes: UserType[];
  setUserTypes: (userTypes: UserType[]) => void;
  setUserType: (userType: UserType) => void;
  deleteUserType: (id: number) => void;
  getUserType: (id: number) => UserType | null;
  updateUserType: (userType: UserType) => void;
}

interface MembershipState {
  memberships: MembershipResponse[];
  setMemberships: (memberships: MembershipResponse[]) => void;
  setMembership: (membership: MembershipResponse) => void;
  getMembership: (id: number) => MembershipResponse | null;
  deleteMembership: (id: number) => void;
  updateMembership: (membership: MembershipResponse) => void;
}

interface ActivityState {
  activities: ActivityResponse[];
  setActivities: (activities: ActivityResponse[]) => void;
  setActivity: (activity: ActivityResponse) => void;
  getActivity: (id: number) => ActivityResponse | null;
  deleteActivity: (id: number) => void;
  updateActivity: (activity: ActivityResponse) => void;
}

interface CreateActivityFirstStep {
  name: string;
  clubId: number;
  type: string;
  hourStart: string;
  hourEnd: string;
  date: Date;
  isActive: boolean;
}

interface CreateActivitySecondStep {
  facilityId: number;
  userId: number;
  cost: number;
}

interface CreateActivityState {
  firstStep: CreateActivityFirstStep;
  secondStep: CreateActivitySecondStep;
  setFirstStep: (firstStep: CreateActivityFirstStep) => void;
  setSecondStep: (secondStep: CreateActivitySecondStep) => void;
}

interface FacilityState {
  facilities: FacilityResponse[];
  setFacilities: (facilities: FacilityResponse[]) => void;
  setFacility: (facility: FacilityResponse) => void;
  getFacility: (id: number) => FacilityResponse | null;
  deleteFacility: (id: number) => void;
  updateFacility: (facility: FacilityResponse) => void;
}

interface CreateFacilityState {
  firstStep: CreateFacilityFirstStep;
  setFirstStep: (firstStep: CreateFacilityFirstStep) => void;
  secondStep: CreateFacilitySecondStep;
  setSecondStep: (secondStep: CreateFacilitySecondStep) => void;
}

interface CreateFacilityFirstStep{
  type: string;
  clubId: number;
  capacity: number;
  isActive: boolean;
}

interface CreateFacilitySecondStep{
  responsibleWorker: number;
  assistantWorker: number;
  membershipTypeIds: number[];
}

interface UserState {
  users: UserResponse[];
  setUsers: (users: UserResponse[]) => void;
  setUser: (user: UserResponse) => void;
  getUser: (id: number) => UserResponse | null;
  deleteUser: (id: number) => void;
  updateUser: (user: UserResponse) => void;
}

interface CreateUserState {
  firstStep: CreateUserFirstStep;
  workerSpecificStep: CreateUserWorkerSpecificStep;
  athleteSpecificStep: CreateUserAthleteSpecificStep;
  setFirstStep: (firstStep: CreateUserFirstStep) => void;
  setWorkerSpecificStep: (workerSpecificStep: CreateUserWorkerSpecificStep) => void;
  setAthleteSpecificStep: (athleteSpecificStep: CreateUserAthleteSpecificStep) => void;
}

interface CreateUserFirstStep{
  name: string;
  clubId: number;
  typeId: number;
  email: string;
  isActive: boolean;
  membership: number;
  document: string;
}

interface CreateUserWorkerSpecificStep{
  salary: number;
  hoursToWorkPerDay: number;
  startWorkAt: Date;
  endWorkAt: Date;
}

interface CreateUserAthleteSpecificStep{
  weight: number;
  height: number;
  gender: string;
  birthDate: string;
  diet: string;
  trainingPlan: string;
  allergies: string;
  medications: string;
  medicalConditions: string;
}

interface EditUserFirstStep {
  name: string;
  typeId: number;
  email: string;
  isActive: boolean;
}

interface EditActivity {
  name: string;
  type: string;
  hourStart: string;
  hourEnd: string;
  date: Date;
  isActive: boolean;
}

interface EditActivityState {
  activity: EditActivity;
  setActivity: (activity: EditActivity) => void;
}

interface EditUserState {
  firstStep: EditUserFirstStep;
  setFirstStep: (firstStep: EditUserFirstStep) => void;
}

export const useEditUserStore = create<EditUserState>()(
  persist(
    (set) => ({
      firstStep: { name: '', typeId: 0, email: '', isActive: true },
      setFirstStep: (firstStep: EditUserFirstStep) => set({ firstStep }),
    }),
    {
      name: 'edit-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useEditActivityStore = create<EditActivityState>()(
  persist(
    (set) => ({
      activity: { name: '', type: '', hourStart: '', hourEnd: '', date: new Date(), isActive: true },
      setActivity: (activity: EditActivity) => set({ activity }),
    }),
    {
      name: 'edit-activity-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token: string) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ token: state.token }),
    }
  )
);

export const useMembershipTypeStore = create<MembershipTypeState>()(
  persist(
    (set, get) => ({
      membershipTypes: [],
      setMembershipTypes: (membershipTypes: MembershipType[]) => set({ membershipTypes }),
      setMembershipType: (membershipType: MembershipType) =>
        set((state) => ({ membershipTypes: [...state.membershipTypes, membershipType] })),
      deleteMembershipType: (id: number) =>
        set((state) => ({ membershipTypes: state.membershipTypes.filter((mt) => mt.id !== id) })),
      updateMembershipType: (membershipType: MembershipType) =>
        set((state) => ({
          membershipTypes: state.membershipTypes.map((mt) => (mt.id === membershipType.id ? membershipType : mt)),
        })),
      getMembershipType: (id: number) => get().membershipTypes.find((mt) => mt.id === id) ?? null,
    }),
    {
      name: 'membership-types-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ membershipTypes: state.membershipTypes }),
    }
  )
);

export const useUserTypeStore = create<UserTypeState>()(
  persist(
    (set, get) => ({
      userTypes: [],
      setUserTypes: (userTypes: UserType[]) => set({ userTypes }),
      setUserType: (userType: UserType) =>
        set((state) => ({ userTypes: [...state.userTypes, userType] })),
      deleteUserType: (id: number) =>
        set((state) => ({ userTypes: state.userTypes.filter((ut) => ut.id !== id) })),
      updateUserType: (userType: UserType) =>
        set((state) => ({
          userTypes: state.userTypes.map((ut) => (ut.id === userType.id ? userType : ut)),
        })),
      getUserType: (id: number) => get().userTypes.find((ut) => ut.id === id) ?? null,
    }),
    {
      name: 'user-types-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ userTypes: state.userTypes }),
    }
  )
);

export const useMembershipStore = create<MembershipState>()(
  persist(
    (set, get) => ({
      memberships: [],
      setMemberships: (memberships: MembershipResponse[]) => set({ memberships }),
      setMembership: (membership: MembershipResponse) =>
        set((state) => ({ memberships: [...state.memberships, membership] })),
      getMembership: (id: number) => get().memberships.find((m) => m.id === id) ?? null,
      deleteMembership: (id: number) => set((state) => ({ memberships: state.memberships.filter((m) => m.id !== id) })),
      updateMembership: (membership: MembershipResponse) => set((state) => ({ memberships: state.memberships.map((m) => m.id === membership.id ? membership : m) })),
    }),
    {
      name: 'memberships-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ memberships: state.memberships }),
    }
  )
);

export const useActivityStore = create<ActivityState>()(
  persist(
    (set, get) => ({
      activities: [],
      setActivities: (activities: ActivityResponse[]) => set({ activities }),
      setActivity: (activity: ActivityResponse) =>
        set((state) => ({ activities: [...state.activities, activity] })),
      getActivity: (id: number) => get().activities.find((a) => a.id === id) ?? null,
      deleteActivity: (id: number) =>
        set((state) => ({ activities: state.activities.filter((a) => a.id !== id) })),
      updateActivity: (activity: ActivityResponse) =>
        set((state) => ({
          activities: state.activities.map((a) => (a.id === activity.id ? activity : a)),
        })),
    }),
    {
      name: 'activities-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ activities: state.activities }),
    }
  )
);

export const useFacilityStore = create<FacilityState>()(
  persist(
    (set, get) => ({
      facilities: [],
      setFacilities: (facilities: FacilityResponse[]) => set({ facilities }),
      setFacility: (facility: FacilityResponse) =>
        set((state) => ({ facilities: [...state.facilities, facility] })),
      getFacility: (id: number) => get().facilities.find((f) => f.id === id) ?? null,
      deleteFacility: (id: number) => set((state) => ({ facilities: state.facilities.filter((f) => f.id !== id) })),
      updateFacility: (facility: FacilityResponse) => set((state) => ({ facilities: state.facilities.map((f) => f.id === facility.id ? facility : f) })),
    }),
    {
      name: 'facilities-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ facilities: state.facilities }),
    }
  )
);

export const useCreateFacilityStore = create<CreateFacilityState>()(
  persist(
    (set) => ({
      firstStep: { type: '', capacity: 0, isActive: true, clubId: 0 },
      secondStep: { responsibleWorker: 0, assistantWorker: 0, membershipTypeIds: [] },
      setFirstStep: (firstStep: CreateFacilityFirstStep) => set({ firstStep }),
      setSecondStep: (secondStep: CreateFacilitySecondStep) => set({ secondStep }),
    }),
    {
      name: 'create-facility-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      setUsers: (users: UserResponse[]) => set({ users }),
      setUser: (user: UserResponse) => set((state) => ({ users: [...state.users, user] })),
      getUser: (id: number) => get().users.find((u) => u.id === id) ?? null,
      deleteUser: (id: number) => set((state) => ({ users: state.users.filter((u) => u.id !== id) })),
      updateUser: (user: UserResponse) => set((state) => ({ users: state.users.map((u) => u.id === user.id ? user : u) })),
    }),
    {
      name: 'users-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ users: state.users }),
    }
  )
);

export const useCreateUserStore = create<CreateUserState>()(
  persist(
    (set) => ({
      firstStep: { name: '', typeId: 0, email: '', isActive: true, membership: 0, clubId: 0, document: '' },
      setFirstStep: (firstStep: CreateUserFirstStep) => set({ firstStep }),
      workerSpecificStep: { salary: 0, hoursToWorkPerDay: 0, startWorkAt: new Date(), endWorkAt: new Date() },
      setWorkerSpecificStep: (workerSpecificStep: CreateUserWorkerSpecificStep) => set({ workerSpecificStep }),
      athleteSpecificStep: { weight: 0, height: 0, gender: '', birthDate: '', diet: '', trainingPlan: '', allergies: '', medications: '', medicalConditions: '' },
      setAthleteSpecificStep: (athleteSpecificStep: CreateUserAthleteSpecificStep) => set({ athleteSpecificStep }),
    }),
    {
      name: 'create-user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useCreateActivityStore = create<CreateActivityState>()(
  persist(
    (set) => ({
      firstStep: { name: '', type: '', hourStart: '', hourEnd: '', date: new Date(), isActive: true, clubId: 0 },
      secondStep: { facilityId: 0, userId: 0, cost: 0 },
      setFirstStep: (firstStep: CreateActivityFirstStep) => set({ firstStep }),
      setSecondStep: (secondStep: CreateActivitySecondStep) => set({ secondStep }),
    }),
    {
      name: 'create-activity-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useClubIdStore = create<ClubIdState>()(
  persist(
    (set) => ({
      clubId: 0,
      setClubId: (clubId: number) => set({ clubId }),
    }),
    {
      name: 'club-id-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ clubId: state.clubId }),
    }
  )
)