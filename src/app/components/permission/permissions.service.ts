import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PermissionModel } from "./permission.model";

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private apiUrl = `${environment.apiUrl}/Permission`;

    constructor(
        private http: HttpClient
    ) { }

    CreateAsync(requestParams: PermissionModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            requestParams,
            { observe: 'response' }
        );
    }

    UpdateAsync(requestParams: PermissionModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            requestParams,
            { observe: 'response' }
        );
    }

    GetAllAsync(): Observable<PermissionModel[]> {
        return this.http.get<PermissionModel[]>(`${this.apiUrl}/`);
    }

    GetByIdAsync(id: number): Observable<PermissionModel> {
        return this.http.get<PermissionModel>(`${this.apiUrl}/${id}`);
    }

    DeleteByIdAsync(id: number): Observable<HttpResponse<void>> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`,
            { observe: 'response' }
        );
    }
}