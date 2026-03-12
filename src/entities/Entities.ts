export interface MembershipType {
    id: number;
    name: string;
}

/*export interface UserType {
    id: number;
    name: string;
}*/

/*export interface UserRole {
    id: number;
    name: string;
}*/

export interface Membership {
    id?: number;
    type: number;
    price: number;
    facilitiesIncluded: string;
}

export interface Activity {
    id?: number;
    name: string;
    type: string;
    startAt: string;
    endAt: string;
    userId: number;
    cost: number;
    facilityId: number;
    isActive?: boolean;
}
