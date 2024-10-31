import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { PositionModel } from "./position.model";

@Injectable({
    providedIn: 'root'
})
export class PositionService {
    private apiUrl = `${environment.apiUrl}/Position`;

    constructor(
        private http: HttpClient,
    ) { }

    CreateAsync(position: PositionModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            position,
            { observe: 'response' }
        );
    }

    UpdateAsync(position: PositionModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            position,
            { observe: 'response' }
        );
    }

    GetByIdAsync(id: number): Observable<PositionModel> {
        return this.http.get<PositionModel>(`${this.apiUrl}/${id}`);
    }

    GetAllAsync(): Observable<PositionModel[]> {
        return this.http.get<PositionModel[]>(`${this.apiUrl}/`);
    }
}