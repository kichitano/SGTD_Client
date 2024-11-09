import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PermissionModel } from "./permission.model";

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private readonly apiUrl = `${environment.apiUrl}/Permission`;

    constructor(
        private readonly http: HttpClient
    ) { }

    createAsync(requestParams: PermissionModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            requestParams,
            { observe: 'response' }
        );
    }

    updateAsync(requestParams: PermissionModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            requestParams,
            { observe: 'response' }
        );
    }

    getAllAsync(): Observable<PermissionModel[]> {
        return this.http.get<PermissionModel[]>(`${this.apiUrl}/`);
    }

    getByIdAsync(id: number): Observable<PermissionModel> {
        return this.http.get<PermissionModel>(`${this.apiUrl}/${id}`);
    }

    deleteByIdAsync(id: number): Observable<HttpResponse<void>> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`,
            { observe: 'response' }
        );
    }
}