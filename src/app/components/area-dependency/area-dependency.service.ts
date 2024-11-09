import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AreaDependencyModel } from '../area/area.model';

@Injectable({
    providedIn: 'root'
})
export class AreaDependencyService {
    private readonly apiUrl = `${environment.apiUrl}/AreaDependency`;

    constructor(
        private readonly http: HttpClient
    ) { }

    createAsync(areaDependency: AreaDependencyModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            {
                parentAreaId: areaDependency.parentAreaId,
                childAreaId: areaDependency.childAreaId
            },
            { observe: 'response' }
        );
    }

    updateAsync(areaDependency: AreaDependencyModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            {
                id: areaDependency.id,
                parentAreaId: areaDependency.parentAreaId,
                childAreaId: areaDependency.childAreaId
            },
            { observe: 'response' }
        );
    }

    getByIdAsync(areaDependencyId: number): Observable<AreaDependencyModel> {
        return this.http.get<AreaDependencyModel>(`${this.apiUrl}/${areaDependencyId}`);
    }

    getAllAsync(): Observable<AreaDependencyModel[]> {
        return this.http.get<AreaDependencyModel[]>(`${this.apiUrl}/`);
    }

    deleteAsync(areaDependencyId: number): Observable<HttpResponse<void>> {
        return this.http.delete<void>(
            `${this.apiUrl}/${areaDependencyId}`,
            { observe: 'response' }
        );
    }
}