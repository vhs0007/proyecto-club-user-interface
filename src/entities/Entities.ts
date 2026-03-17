export interface MembershipType {
    id: number;
    name: string;
    price: number;
    facilitiesIncluded?: string;
}

export interface UserType {
    id: number;
    name: string;
}

/*export interface UserRole {
    id: number;
    name: string;
}*/

export interface User {
    id?: number;
    name: string;
    typeId: number;
    email?: string | null;
    password?: string | null;
    createdAt?: Date;
    deletedAt?: Date | null;
    isActive: boolean;
    salary?: number | null;
    hoursToWorkPerDay?: number | null;
    startWorkAt?: Date | null;
    endWorkAt?: Date | null;
    weight?: number | null;
    height?: number | null;
    gender?: string | null;
    birthDate?: Date | null;
    diet?: string | null;
    trainingPlan?: string | null;
    medicalHistory?: string | null;
    allergies?: string | null;
    medications?: string | null;
    medicalConditions?: string | null;
}

export interface UserResponse {
    id: number;
    name: string;
    typeId: number;
    type?: UserType;
    email?: string | null;
    password?: string | null;
    createdAt?: Date;
    deletedAt?: Date | null;
    isActive: boolean;
    salary?: number | null;
    hoursToWorkPerDay?: number | null;
    startWorkAt?: Date | null;
    endWorkAt?: Date | null;
    weight?: number | null;
    height?: number | null;
    gender?: string | null;
    birthDate?: Date | null;
    diet?: string | null;
    trainingPlan?: string | null;
    medicalHistory?: string | null;
    allergies?: string | null;
    medications?: string | null;
    medicalConditions?: string | null;
}


export interface Membership {
    id?: number;
    type: number;
    userId: number;
}

export interface MembershipResponse {
    id: number;
    user: UserResponse;
    membershipType: MembershipType;
}

/** Request: CreateFacilityDto / Update */
export interface Facility {
    id?: number;
    type: string;
    capacity: number;
    responsibleWorker: number;
    assistantWorker?: number | null;
    isActive?: boolean;
    membershipTypeIds: number[];
}

/** Navegación: tipo de usuario (id, name) */
export interface UserTypeNavigation {
    id: number;
    name: string;
}

/** Navegación: trabajador en respuesta de instalación */
export interface WorkerNavigation {
    id: number;
    name: string;
    type: UserTypeNavigation;
    email: string | null;
    password: string | null;
    createdAt: Date;
    deletedAt: Date | null;
    isActive: boolean;
}

/** Navegación: usuario en actividades */
export interface UserNavigation {
    id: number;
    name: string;
    type: UserTypeNavigation;
    email: string | null;
    createdAt: Date;
    deletedAt: Date | null;
    isActive: boolean;
}

/** Navegación: actividad en respuesta de instalación */
export interface ActivitiesNavigation {
    id: number;
    name: string;
    type: string;
    startAt: Date;
    endAt: Date;
    user: UserNavigation;
    cost: number;
    isActive: boolean;
}

/** Navegación: tipo de membresía en respuesta de instalación */
export interface MembershipTypeNavigation {
    id: number;
    name: string;
    price: number;
}

/** Response: FacilityResponseDto */
export interface FacilityResponse {
    id: number;
    type: string;
    capacity: number;
    responsibleWorker: WorkerNavigation;
    assistantWorker: WorkerNavigation | null;
    isActive: boolean;
    activities: ActivitiesNavigation[];
    membershipTypes: MembershipTypeNavigation[];
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

export interface ActivityResponse {
    id: number;
    name: string;
    type: string;
    startAt: string;
    endAt: string;
    user: UserResponse;
    cost: number;
    facility: FacilityResponse;
}
