import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

import { PersonModel } from "./people.model";


@Injectable({
    providedIn: 'root'
})
export class PeopleService {
    private apiUrl = `${environment.apiUrl}/Person`;

    constructor(
        private http: HttpClient,
    ) { }

    CreateAsync(person: PersonModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            {
                firstName: person.firstName,
                lastName: person.lastName,
                phone: person.phone,
                nationalityCode: person.nationalityCode,
                documentNumber: person.documentNumber,
                gender: person.gender
            },
            { observe: 'response' }
        );
    }

    GetByIdAsync(personId: number): Observable<PersonModel> {
        return this.http.get<PersonModel>(`${this.apiUrl}/${personId}`);
    }

    GetAllAsync(): Observable<PersonModel[]> {
        return this.http.get<PersonModel[]>(`${this.apiUrl}/`);
    }
}