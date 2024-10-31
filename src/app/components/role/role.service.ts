import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { RoleModel } from "./role.model";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private apiUrl = `${environment.apiUrl}/Role`;

    constructor(
        private http: HttpClient,
    ) { }

    CreateReturnIdAsync(role: RoleModel): Observable<RoleModel> {
        return this.http.post<RoleModel>(
            `${this.apiUrl}/return`,
            role,
        );
    }

    UpdateAsync(role: RoleModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            role,
            { observe: 'response' }
        );
    }

    GetByIdAsync(id: number): Observable<RoleModel> {
        return this.http.get<RoleModel>(`${this.apiUrl}/${id}`);
    }

    GetAllAsync(): Observable<RoleModel[]> {
        return this.http.get<RoleModel[]>(`${this.apiUrl}/`);
    }
}