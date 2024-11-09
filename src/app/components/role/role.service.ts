import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { RoleModel } from "./role.model";

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private readonly apiUrl = `${environment.apiUrl}/Role`;

    constructor(
        private readonly http: HttpClient,
    ) { }

    createReturnIdAsync(role: RoleModel): Observable<number> {
        return this.http.post<number>(
            `${this.apiUrl}/return`,
            role,
        );
    }

    updateAsync(role: RoleModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            role,
            { observe: 'response' }
        );
    }

    getByIdAsync(id: number): Observable<RoleModel> {
        return this.http.get<RoleModel>(`${this.apiUrl}/${id}`);
    }

    getAllAsync(): Observable<RoleModel[]> {
        return this.http.get<RoleModel[]>(`${this.apiUrl}/`);
    }
}