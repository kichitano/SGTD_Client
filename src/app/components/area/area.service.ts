import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AreaModel } from "./area.model";

@Injectable({
    providedIn: 'root'
})
export class AreaService {
    private readonly apiUrl = `${environment.apiUrl}/Area`;

    constructor(
        private readonly http: HttpClient,
    ) { }

    createAsync(area: AreaModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            {
                name: area.name,
                description: area.description,
                status: area.status,
                parentAreaId: area.parentAreaId
            },
            { observe: 'response' }
        );
    }

    updateAsync(area: AreaModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            {
                id: area.id,
                name: area.name,
                description: area.description,
                status: area.status,
                parentAreaId: area.parentAreaId
            },
            { observe: 'response' }
        );
    }

    getByIdAsync(areaId: number): Observable<AreaModel> {
        return this.http.get<AreaModel>(`${this.apiUrl}/${areaId}`);
    }

    getAllAsync(): Observable<AreaModel[]> {
        return this.http.get<AreaModel[]>(`${this.apiUrl}/`);
    }
}