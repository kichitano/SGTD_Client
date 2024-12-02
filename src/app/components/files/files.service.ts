import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { UserFileModel } from "./files.model";

@Injectable({
    providedIn: 'root'
})
export class FilesService {
    private readonly apiUrl = `${environment.apiUrl}/UserFile`;

    constructor(
        private readonly http: HttpClient,
    ) { }

    uploadFiles(files: File[], userGuid: string): Observable<any> {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        return this.http.post(`${this.apiUrl}/upload/${userGuid}`, formData, {
            observe: 'response'
        });
    }

    getByUserGuIdAsync(userGuid: string): Observable<UserFileModel[]> {
        return this.http.get<UserFileModel[]>(`${this.apiUrl}/${userGuid}`);
    }

    downloadFileAsync(id: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/download/${id}`, {
            responseType: 'blob'
        });
    }
}