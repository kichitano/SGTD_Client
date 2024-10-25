import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PeopleListComponent } from '../../app/components/people/people-list/people-list.component';
import { MenuOptionsEnum } from '../../app/components/panel/panel.model';
import { AreaListComponent } from '../../app/components/area/area-list/area-list.component';

@Injectable({
    providedIn: 'root'
})
export class ComponentLoaderService {
    private componentToLoad = new BehaviorSubject<Type<any> | null>(null);
    currentComponent$ = this.componentToLoad.asObservable();

    loadComponent(componentName: string) {
        switch (componentName) {
            case MenuOptionsEnum.Personas:
                this.componentToLoad.next(PeopleListComponent);
                break;
            case MenuOptionsEnum.Areas:
                this.componentToLoad.next(AreaListComponent);
                break;
            // case MenuOptionsEnum.Areas:
            //     this.componentToLoad.next(AreaListComponent);
            //     break;
            // ... agregar los demas componentes, siempre usar el list que es la primera vista
            default:
                this.componentToLoad.next(null);
        }
    }
}