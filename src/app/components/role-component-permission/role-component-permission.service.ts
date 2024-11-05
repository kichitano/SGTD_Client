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

    CreateAsync(requestParams: RoleComponentPermissionModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            requestParams,
            { observe: 'response' }
        );
    }

    CreateArrayAsync(permissions: RoleComponentPermissionModel[]): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/array`,
            permissions,
            { observe: 'response' }
        );
    }

    UpdateAsync(requestParams: RoleComponentPermissionModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            requestParams,
            { observe: 'response' }
        );
    }

    UpdateArrayAsync(roleId: number, permissions: RoleComponentPermissionModel[]): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/array/${roleId}`,
            permissions,
            { observe: 'response' }
        );
    }

    GetAllAsync(): Observable<RoleComponentPermissionModel[]> {
        return this.http.get<RoleComponentPermissionModel[]>(`${this.apiUrl}/`);
    }

    GetByIdAsync(id: number): Observable<RoleComponentPermissionModel> {
        return this.http.get<RoleComponentPermissionModel>(`${this.apiUrl}/${id}`);
    }

    GetByRoleIdAsync(roleId: number): Observable<RoleComponentPermissionModel[]> {
        return this.http.get<RoleComponentPermissionModel[]>(`${this.apiUrl}/role/${roleId}`);
    }

    DeleteByIdAsync(id: number): Observable<HttpResponse<void>> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`,
            { observe: 'response' }
        );
    }
}