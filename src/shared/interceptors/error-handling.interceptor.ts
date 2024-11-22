import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { ERROR_MESSAGES } from '../models.model';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {
  constructor(private readonly messageService: MessageService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string;

        if (error.status === 400) {
          errorMessage = error.error;
        } else {
          errorMessage = ERROR_MESSAGES[error.status] || ERROR_MESSAGES[500];
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
          life: 3000
        });

        if (error.status === 500) {
          console.error('Error no controlado:', error.error);
        }

        return throwError(() => error);
      })
    );
  }
}


