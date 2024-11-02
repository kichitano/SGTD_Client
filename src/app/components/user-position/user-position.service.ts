import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { UserPositionModel } from "./user-position.model";

@Injectable({
    providedIn: 'root'
})
export class UserPositionService {
    private apiUrl = `${environment.apiUrl}/UserPosition`;

    constructor(
        private http: HttpClient
    ) { }

    CreateAsync(userPosition: UserPositionModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            userPosition,
            { observe: 'response' }
        );
    }

    UpdateAsync(userPosition: UserPositionModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            userPosition,
            { observe: 'response' }
        );
    }

    GetByIdAsync(id: number): Observable<UserPositionModel> {
        return this.http.get<UserPositionModel>(`${this.apiUrl}/${id}`);
    }

    GetAllAsync(): Observable<UserPositionModel[]> {
        return this.http.get<UserPositionModel[]>(`${this.apiUrl}/`);
    }

    DeleteByIdAsync(id: number): Observable<HttpResponse<void>> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`,
            { observe: 'response' }
        );
    }
}