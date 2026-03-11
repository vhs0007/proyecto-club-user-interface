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
