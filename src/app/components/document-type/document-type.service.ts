import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { DocumentTypeModel } from "./document-type.model";

@Injectable({
    providedIn: 'root'
})
export class DocumentTypeService {
    private readonly apiUrl = `${environment.apiUrl}/DocumentType`;

    constructor(
        private readonly http: HttpClient,
    ) { }

    createAsync(documentType: DocumentTypeModel): Observable<HttpResponse<void>> {
        return this.http.post<void>(
            `${this.apiUrl}/`,
            documentType,
            { observe: 'response' }
        );
    }

    updateAsync(documentType: DocumentTypeModel): Observable<HttpResponse<void>> {
        return this.http.put<void>(
            `${this.apiUrl}/`,
            documentType,
            { observe: 'response' }
        );
    }

    getByIdAsync(id: number): Observable<DocumentTypeModel> {
        return this.http.get<DocumentTypeModel>(`${this.apiUrl}/${id}`);
    }

    getAllAsync(): Observable<DocumentTypeModel[]> {
        return this.http.get<DocumentTypeModel[]>(`${this.apiUrl}/`);
    }
}