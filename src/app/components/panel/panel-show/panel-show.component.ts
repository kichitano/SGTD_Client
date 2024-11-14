import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ImageBleedDirective } from '../../../../shared/directives/ImageBleed';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ComponentLoaderService } from '../../../../shared/services/ComponentLoader.service';
import { MenuOptionsEnum, UserMenuOptionsEnum } from '../panel.model';


@Component({
  selector: 'app-panel-show',
  standalone: true,
  imports: [
    ImageBleedDirective,
    MenubarModule,
    CardModule
  ],
  templateUrl: './panel-show.component.html',
  styleUrl: './panel-show.component.scss'
})
export class PanelShowComponent implements OnInit {

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true })
  containerRef!: ViewContainerRef;

  menuItems: MenuItem[] = [];

  constructor(
    private readonly componentLoader: ComponentLoaderService
  ) { }

  ngOnInit() {
    this.menuItems = Object.keys(MenuOptionsEnum).map(key => ({
      label: key,
      icon: this.getIconByMenuOption(MenuOptionsEnum[key as keyof typeof MenuOptionsEnum]),
      command: () => this.loadPanel(MenuOptionsEnum[key as keyof typeof MenuOptionsEnum])
    }));

    this.componentLoader.currentComponent$.subscribe(component => {
      if (component) {
        this.containerRef.clear();
        this.containerRef.createComponent(component);
      }
    });

    this.loadPanel(UserMenuOptionsEnum.OpcionesUsuario);
  }

  loadPanel(componentName: string) {
    this.componentLoader.loadComponent(componentName);
  }

  private getIconByMenuOption(option: MenuOptionsEnum): string {
    switch (option) {
      case MenuOptionsEnum.Personas:
        return 'pi pi-fw pi-users';
      case MenuOptionsEnum.Areas:
        return 'pi pi-fw pi-building';
      case MenuOptionsEnum.Cargos:
        return 'pi pi-fw pi-briefcase';
      case MenuOptionsEnum.Usuarios:
        return 'pi pi-fw pi-user';
      case MenuOptionsEnum.Modulos:
        return 'pi pi-fw pi-table';
      case MenuOptionsEnum.Roles:
        return 'pi pi-fw pi-objects-column';
      default:
        return '';
    }
  }

  clearContainer() {
    this.containerRef.clear();
    this.loadPanel(UserMenuOptionsEnum.OpcionesUsuario);
  }

}