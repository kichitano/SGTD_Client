import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PositionRoleModel } from "./position-role.model";

@Injectable({
    providedIn: 'root'
})
export class PositionRoleService {
    private readonly apiUrl = `${environment.apiUrl}/PositionRole`;

    constructor(
        private readonly http: HttpClient,
    ) { }

    createAsync(positionRole: PositionRoleModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            positionRole,
            { observe: 'response' }
        );
    }

    deleteByPositionIdAsync(positionId: number): Observable<HttpResponse<void>> {
        return this.http.delete<void>(
            `${this.apiUrl}/position/${positionId}`,
            { observe: 'response' }
        );
    }

    getByPositionIdAsync(positionId: number): Observable<PositionRoleModel[]> {
        return this.http.get<PositionRoleModel[]>(`${this.apiUrl}/position/${positionId}`);
    }
}