export interface PersonModel {
    id: number;
    firstName: string;
    lastName: string;
    phone: string;
    nationalityCode: string;
    documentNumber: string;
    gender: boolean;
    fullName?: string;
}

export interface GenderModel {
    name: string,
    value: boolean
}