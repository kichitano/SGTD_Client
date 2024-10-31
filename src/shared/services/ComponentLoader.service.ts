import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PeopleListComponent } from '../../app/components/people/people-list/people-list.component';
import { MenuOptionsEnum } from '../../app/components/panel/panel.model';
import { AreaListComponent } from '../../app/components/area/area-list/area-list.component';
import { PositionListComponent } from '../../app/components/position/position-list/position-list.component';
import { ComponentListComponent } from '../../app/components/component/component-list/component-list.component';
import { RoleListComponent } from '../../app/components/role/role-list/role-list.component';

@Injectable({
    providedIn: 'root'
})
export class ComponentLoaderService {
    private readonly componentToLoad = new BehaviorSubject<Type<any> | null>(null);
    currentComponent$ = this.componentToLoad.asObservable();

    loadComponent(componentName: string) {
        switch (componentName) {
            case MenuOptionsEnum.Personas:
                this.componentToLoad.next(PeopleListComponent);
                break;
            case MenuOptionsEnum.Areas:
                this.componentToLoad.next(AreaListComponent);
                break;
            case MenuOptionsEnum.Cargos:
                this.componentToLoad.next(PositionListComponent);
                break;
            case MenuOptionsEnum.Modulos:
                this.componentToLoad.next(ComponentListComponent);
                break;
            case MenuOptionsEnum.Roles:
                this.componentToLoad.next(RoleListComponent);
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