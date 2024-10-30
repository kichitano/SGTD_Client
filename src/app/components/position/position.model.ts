import { RoleModel } from "../role/role.model";

export interface PositionRoleModel {
    id: number;
    positionId: number;
    roleId: number;
    role?: RoleModel;
}

export interface PositionModel {
    id: number;
    name: string;
    description: string;
    areaId: number;
    parentPositionId?: number;
    positionRoles?: PositionRoleModel[];
}