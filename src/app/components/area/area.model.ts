export interface AreaModel {
    id: number;
    name: string;
    description: string;
    status: boolean;
    parentAreaId?: number;
}

export interface AreaDependencyModel {
    id: number;
    parentAreaId: number;
    parentArea?: AreaModel;
    childAreaId: number;
    childArea?: AreaModel;
}