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
    membership?: UserMembershipNavigation;
    medicalConditions?: string | null;
    facilities?: FacilityNavigation[];
    scheduleActivities?: ScheduledActivityNavigation[] | null;
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

/** Navegación embebida en UserResponse (API: arreglo de membresías) */
export interface UserMembershipNavigation {
    id: number;
    expiration: string | Date;
    createdAt?: string | Date;
    membershipType: MembershipType;
}

/** Request: CreateFacilityDto / Update */
export interface Facility {
    id?: number;
    clubId: number;
    type: string;
    capacity: number;
    responsibleWorker: number;
    assistantWorkers?: number[] | null;
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
    typeId?: number | null;
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
    assistantWorkers: WorkerNavigation[] | null;
    isActive: boolean;
    activities: ActivitiesNavigation[];
    membershipTypes: MembershipTypeNavigation[];
    scheduleActivities?: ScheduledActivityNavigation[];
}

export interface FacilityWorkerResponse {
    clubId: number;
    facilityNavigation: FacilityNavigation[];
    userNavigation: UserNavigation;
}

export interface FacilityNavigation {
    id: number;
    clubId: number;
    type: string;
    capacity: number;
    responsibleWorker: WorkerNavigation;
    assistantWorkers: WorkerNavigation[] | null;
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
    isActive: boolean;
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

/** Request: CreateFacilityWorkerDto / UpdateFacilityWorkerDto */
export interface FacilityWorkerRequest {
    facilityId: number[];
    userId: number;
    userTypeId: number;
    clubId: number;
}

export interface WorkingDayNavigation {
    id: number;
    dayOfWeek: string;
}

export interface DatetimeScheduledActivityRequest {
    hourStart: string;
    hourEnd: string;
    workingDayId: number;
}

export interface DatetimeScheduledActivityNavigation {
    hourStart: string;
    hourEnd: string;
    workingDay: WorkingDayNavigation;
}

export interface ScheduledActivityNavigation {
    id: number;
    clubId: number;
    membershipTypes: MembershipTypeNavigation[];
    responsibleWorker: UserNavigation;
    assistantWorkers: UserNavigation[];
    datetimeScheduledActivities: DatetimeScheduledActivityNavigation[];
}

/** Request: CreateScheduledActivityDto */
export interface ScheduledActivityRequest {
    clubId: number;
    facilityId: number;
    userId: number;
    userTypeId: number;
    membershipTypesIds: number[];
    datetimeScheduledActivities: DatetimeScheduledActivityRequest[];
    assistantWorkerIds: number[];
    name: string;
}

/** Body: UpdateScheduledActivityDto */
export interface UpdateScheduledActivityRequest {
    clubId?: number;
    facilityId?: number;
    userId?: number;
    userTypeId?: number;
    membershipTypesIds?: number[];
    datetimeScheduledActivities?: DatetimeScheduledActivityRequest[];
    assistantWorkerIds?: number[];
    name?: string;
}

/** Query: QueryScheduledActivityDto (update, delete, findById) */
export interface ScheduledActivityQuery {
    clubId: number;
    id: number;
}

/** Response: ScheduledActivityResponseDto */
export interface ScheduledActivityResponse {
    id: number;
    clubId: number;
    facility: FacilityNavigation;
    userId: number;
    user: UserNavigation;
    userTypeId: number;
    assistantWorkers: UserNavigation[];
    membershipTypes: MembershipTypeNavigation[];
    datetimeScheduledActivities: DatetimeScheduledActivityNavigation[];
    name: string;
}