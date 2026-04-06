export interface MembershipType {
    id: number;
    clubId: number;
    name: string;
    price: number;
    facilitiesIncluded?: string;
}

export interface UserType {
    id: number;
    clubId: number;
    name: string;
}

export interface User {
    id?: number;
    clubId: number;
    name: string;
    typeId: number;
    document: string;
    email?: string | null;
    password?: string | null;
    createdAt?: Date;
    deletedAt?: Date | null;
    isActive: boolean;
    salary?: number | null;
    hoursToWorkPerDay?: number | null;
    employmentStartDate?: Date | null;
    startWorkAt?: string | null;
    endWorkAt?: string | null;
    weight?: number | null;
    height?: number | null;
    gender?: string | null;
    birthDate?: Date | null;
    diet?: string | null;
    trainingPlan?: string | null;
    allergies?: string | null;
    medications?: string | null;
    medicalConditions?: string | null;
}

export interface UserResponse {
    id: number;
    clubId: number;
    name: string;
    typeId: number;
    type?: UserType;
    document: string;
    email?: string | null;
    password?: string | null;
    createdAt?: Date;
    deletedAt?: Date | null;
    isActive: boolean;
    salary?: number | null;
    hoursToWorkPerDay?: number | null;
    employmentStartDate?: Date | null;
    startWorkAt?: string | null;
    endWorkAt?: string | null;
    weight?: number | null;
    height?: number | null;
    gender?: string | null;
    birthDate?: Date | null;
    diet?: string | null;
    trainingPlan?: string | null;
    allergies?: string | null;
    medications?: string | null;
    membership?: MembershipResponse | null;
    medicalConditions?: string | null;
}


export interface Membership {
    id?: number;
    clubId: number;
    type: number;
    userId: number;
}

export interface MembershipResponse {
    id: number;
    clubId: number;
    user: UserResponse;
    membershipType: MembershipType;
    expiration: Date;
    createdAt: Date;
}

/** Request: CreateFacilityDto / Update */
export interface Facility {
    id?: number;
    clubId: number;
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
    clubId: number;
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
    clubId: number;
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
    clubId: number;
    name: string;
    type: string;
    date: Date;
    hourStart: string;
    hourEnd: string;
    user: UserNavigation;
    cost: number;
    isActive: boolean;
}

/** Navegación: tipo de membresía en respuesta de instalación */
export interface MembershipTypeNavigation {
    id: number;
    clubId: number;
    name: string;
    price: number;
}

/** Response: FacilityResponseDto */
export interface FacilityResponse {
    id: number;
    clubId: number;
    type: string;
    capacity: number;
    responsibleWorker: WorkerNavigation;
    assistantWorker: WorkerNavigation | null;
    isActive: boolean;
    activities: ActivitiesNavigation[];
    membershipTypes: MembershipTypeNavigation[];
}

export interface FacilityNavigation {
    id: number;
    clubId: number;
    type: string;
    capacity: number;
    responsibleWorker: WorkerNavigation;
    assistantWorker: WorkerNavigation | null;
    isActive: boolean;
}

export interface Activity {
    id?: number;
    clubId: number;
    name: string;
    type: string;
    hourStart: string;
    date: Date;
    hourEnd: string;
    userId: number;
    cost: number;
    facilityId: number;
    isActive?: boolean;
}

export interface ActivityResponse {
    id: number;
    clubId: number;
    name: string;
    type: string;
    hourStart: string;
    date: Date;
    hourEnd: string;
    user: UserNavigation;
    cost: number;
    facility: FacilityNavigation;
}

export interface Club{
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo: string | null;
    isActive: boolean;
}

export interface SalaryReportRequest {
    userId: number;
}

export interface SalaryReportResponse {
    user: UserResponse;
    salary: number;
    hoursWorked: number;
    hoursToWorkPerMonth: number;
    extraHours: number;
    totalSalary: number;
}

export interface NewUsersReportRequest {
    clubId: number;
    typeId: number;
    date: string;
}

export interface NewUsersReportResponse {
    users: UserResponse[];
    totalUsers: number;
}

export interface MonthIncomeReportRequest {
    clubId: number;
    date: string;
}

export interface MonthIncomeReportResponse {
    month: string;
    monthIncomeTotal: number;
    monthIncomeMemberships: number;
    monthIncomeActivities: number;
}

export interface MonthIncomeProgressionReportRequest {
    clubId: number;
    dateStart: string;
    dateEnd: string;
}

export interface MonthIncomeProgressionReportResponse {
    dateStart: string;
    dateEnd: string;
    totalIncome: number;
    totalIncomeMemberships: number;
    totalIncomeActivities: number;
    monthlyIncomes: MonthIncomeReportResponse[];
}