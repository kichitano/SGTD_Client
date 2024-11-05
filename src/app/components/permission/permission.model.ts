export interface PermissionModel {
    id: number;
    name: string;
}

export enum PermissionName {
    Create = 'Create',
    Read = 'Read',
    Update = 'Update',
    Delete = 'Delete'
}