import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Activity, Membership, MembershipType, UserType } from '../entities/Entities';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
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
  memberships: Membership[];
  setMemberships: (memberships: Membership[]) => void;
  setMembership: (membership: Membership) => void;
  getMembership: (id: number) => Membership | null;
  deleteMembership: (id: number) => void;
  updateMembership: (membership: Membership) => void;
}

interface ActivityState {
  activities: Activity[];
  setActivities: (activities: Activity[]) => void;
  setActivity: (activity: Activity) => void;
  getActivity: (id: number) => Activity | null;
  deleteActivity: (id: number) => void;
  updateActivity: (activity: Activity) => void;
}

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
      setMemberships: (memberships: Membership[]) => set({ memberships }),
      setMembership: (membership: Membership) =>
        set((state) => ({ memberships: [...state.memberships, membership] })),
      getMembership: (id: number) => get().memberships.find((m) => m.id === id) ?? null,
      deleteMembership: (id: number) => set((state) => ({ memberships: state.memberships.filter((m) => m.id !== id) })),
      updateMembership: (membership: Membership) => set((state) => ({ memberships: state.memberships.map((m) => m.id === membership.id ? membership : m) })),
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
      setActivities: (activities: Activity[]) => set({ activities }),
      setActivity: (activity: Activity) =>
        set((state) => ({ activities: [...state.activities, activity] })),
      getActivity: (id: number) => get().activities.find((a) => a.id === id) ?? null,
      deleteActivity: (id: number) =>
        set((state) => ({ activities: state.activities.filter((a) => a.id !== id) })),
      updateActivity: (activity: Activity) =>
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
