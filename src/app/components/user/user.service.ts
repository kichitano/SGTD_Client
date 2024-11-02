import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { UserModel } from "./user.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly apiUrl = `${environment.apiUrl}/User`;

    constructor(
        private readonly http: HttpClient
    ) { }

    CreateAsync(user: UserModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            user,
            { observe: 'response' }
        );
    }

    CreateReturnGuidAsync(position: UserModel): Observable<string> {
        return this.http.post<string>(
            `${this.apiUrl}/return`,
            position,
        );
    }

    UpdateAsync(user: UserModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            user,
            { observe: 'response' }
        );
    }

    GetByGuidAsync(guid: string): Observable<UserModel> {
        return this.http.get<UserModel>(`${this.apiUrl}/${guid}`);
    }

    GetAllAsync(): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(`${this.apiUrl}/`);
    }

    DeleteByIdAsync(id: number): Observable<HttpResponse<void>> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`,
            { observe: 'response' }
        );
    }
}