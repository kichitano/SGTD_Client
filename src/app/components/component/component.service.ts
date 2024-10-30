import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ComponentModel } from "./component.model";

@Injectable({
    providedIn: 'root'
})
export class ComponentService {
    private apiUrl = `${environment.apiUrl}/Component`;

    constructor(
        private http: HttpClient,
    ) { }

    CreateAsync(component: ComponentModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            component,
            { observe: 'response' }
        );
    }

    UpdateAsync(component: ComponentModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            component,
            { observe: 'response' }
        );
    }

    GetByIdAsync(id: number): Observable<ComponentModel> {
        return this.http.get<ComponentModel>(`${this.apiUrl}/${id}`);
    }

    GetAllAsync(): Observable<ComponentModel[]> {
        return this.http.get<ComponentModel[]>(`${this.apiUrl}/`);
    }
}