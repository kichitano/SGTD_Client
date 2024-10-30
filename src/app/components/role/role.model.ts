export interface RoleModel {
    id: number;
    name: string;
    description: string;
    permissionCount?: number;
}

export interface PermissionMatrix {
    componentId: number;
    componentName: string;
    allSelected?: boolean;
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
}