import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { UserRoleModel } from "./user-role.model";

@Injectable({
    providedIn: 'root'
})
export class UserRoleService {
    private readonly apiUrl = `${environment.apiUrl}/UserRole`;

    constructor(
        private readonly http: HttpClient,
    ) { }

    createAsync(userRole: UserRoleModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            userRole,
            { observe: 'response' }
        );
    }

    deleteByUserGuidAsync(userGuid: string): Observable<HttpResponse<void>> {
        return this.http.delete<void>(
            `${this.apiUrl}/user/${userGuid}`,
            { observe: 'response' }
        );
    }

    getByUserGuidAsync(userGuid: string): Observable<UserRoleModel[]> {
        return this.http.get<UserRoleModel[]>(`${this.apiUrl}/user/${userGuid}`);
    }
}