import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "../../environments/environment";
import { CountryModel } from "../models.model";


@Injectable({
    providedIn: 'root'
})
export class CountryService {
    private readonly apiUrl = `${environment.apiUrl}/Country`;

    constructor(
        private readonly http: HttpClient,
    ) { }

    GetAllAsync(): Observable<CountryModel[]> {
        return this.http.get<CountryModel[]>(`${this.apiUrl}/`);
    }
}