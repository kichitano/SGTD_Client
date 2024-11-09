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

    createAsync(user: UserModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            user,
            { observe: 'response' }
        );
    }

    createReturnGuidAsync(position: UserModel): Observable<string> {
        return this.http.post<string>(
            `${this.apiUrl}/return`,
            position,
        );
    }

    updateAsync(user: UserModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            user,
            { observe: 'response' }
        );
    }

    getByGuidAsync(guid: string): Observable<UserModel> {
        return this.http.get<UserModel>(`${this.apiUrl}/${guid}`);
    }

    getAllAsync(): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(`${this.apiUrl}/`);
    }

    deleteByIdAsync(id: number): Observable<HttpResponse<void>> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`,
            { observe: 'response' }
        );
    }
}