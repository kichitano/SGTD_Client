import { Injectable } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpinnerPrimeNgService {
  observableSpinnerVisible = new Subject<boolean>();
  listaObservables: number[] = [];

  show(): void {
    this.listaObservables.push(1);
    this.observableSpinnerVisible.next(true);
  }

  hide(): void {
    this.listaObservables.pop();

    if (this.listaObservables.length == 0) {
      this.observableSpinnerVisible.next(false);
    }
  }

  use<T>(observable: Observable<T>): Observable<T> {
    this.show();

    return observable.pipe(
      finalize(() => {
        this.hide();
      })
    );
  }
}
