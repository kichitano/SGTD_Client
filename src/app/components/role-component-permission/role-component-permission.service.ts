import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { RoleComponentPermissionModel } from "./role-component-permission.model";

@Injectable({
    providedIn: 'root'
})
export class RoleComponentPermissionService {
    private readonly apiUrl = `${environment.apiUrl}/RoleComponentPermission`;

    constructor(
        private readonly http: HttpClient
    ) { }

    createAsync(requestParams: RoleComponentPermissionModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            requestParams,
            { observe: 'response' }
        );
    }

    createArrayAsync(permissions: RoleComponentPermissionModel[]): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/array`,
            permissions,
            { observe: 'response' }
        );
    }

    updateAsync(requestParams: RoleComponentPermissionModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            requestParams,
            { observe: 'response' }
        );
    }

    updateArrayAsync(roleId: number, permissions: RoleComponentPermissionModel[]): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/array/${roleId}`,
            permissions,
            { observe: 'response' }
        );
    }

    getAllAsync(): Observable<RoleComponentPermissionModel[]> {
        return this.http.get<RoleComponentPermissionModel[]>(`${this.apiUrl}/`);
    }

    getByIdAsync(id: number): Observable<RoleComponentPermissionModel> {
        return this.http.get<RoleComponentPermissionModel>(`${this.apiUrl}/${id}`);
    }

    getByRoleIdAsync(roleId: number): Observable<RoleComponentPermissionModel[]> {
        return this.http.get<RoleComponentPermissionModel[]>(`${this.apiUrl}/role/${roleId}`);
    }

    deleteByIdAsync(id: number): Observable<HttpResponse<void>> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`,
            { observe: 'response' }
        );
    }
}