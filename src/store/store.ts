import { create } from 'zustand';
import type { Membership, MembershipType } from '../entities/Entities';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

interface MembershipTypeState {
  membershipTypes: MembershipType[];
  setMembershipTypes: (membershipTypes: MembershipType[]) => void;
}

interface MembershipState {
  memberships: Membership[];
  setMemberships: (memberships: Membership[]) => void;
}

const getTokenFromStorage = (): string | null => {
  return sessionStorage.getItem('accessToken');
};

export const useAuthStore = create<AuthState>((set) => ({
  token: getTokenFromStorage(),
  setToken: (token: string) => {
    sessionStorage.setItem('accessToken', token);
    set({ token });
  },
  logout: () => {
    sessionStorage.removeItem('accessToken');
    set({ token: null });
  },
}));

export const useMembershipTypeStore = create<MembershipTypeState>((set) => ({
  membershipTypes: [],
  setMembershipTypes: (membershipTypes: MembershipType[]) => {
    set({ membershipTypes });
  },
  setMembershipType: (membershipType: MembershipType) => {
    set((state) => ({ membershipTypes: [...state.membershipTypes, membershipType] }));
  },
  deleteMembershipType: (id: number) => {
    set((state) => ({ membershipTypes: state.membershipTypes.filter((membershipType) => membershipType.id !== id) }));
  },
  updateMembershipType: (membershipType: MembershipType) => {
    set((state) => ({ membershipTypes: state.membershipTypes.map((membershipType) => membershipType.id === membershipType.id ? membershipType : membershipType) }));
  },
}));

export const useMembershipStore = create<MembershipState>((set) => ({
  memberships: [],
  setMemberships: (memberships: Membership[]) => {
    set({ memberships });
  },
  setMembership: (membership: Membership) => {
    set((state) => ({ memberships: [...state.memberships, membership] }));
  },
}));

