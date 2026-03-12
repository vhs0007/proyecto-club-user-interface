import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Membership, MembershipType } from '../entities/Entities';

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

interface MembershipState {
  memberships: Membership[];
  setMemberships: (memberships: Membership[]) => void;
  setMembership: (membership: Membership) => void;
  getMembership: (id: number) => Membership | null;
  deleteMembership: (id: number) => void;
  updateMembership: (membership: Membership) => void;
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
