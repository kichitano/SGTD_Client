import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageBleedDirective } from '../../../../shared/directives/ImageBleed';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ComponentLoaderService } from '../../../../shared/services/ComponentLoader.service';
import { MenuOptionsEnum } from '../panel.model';

interface Empresa {
  id: number;
  nombre: string;
  descripcion: string;
  detalle: string;
  imagen: string;
}

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
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly componentLoader: ComponentLoaderService
  ) { }

  ngOnInit() {
    // Crear el menú usando el enum
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
  }

  loadPanel(componentName: string) {
    this.componentLoader.loadComponent(componentName);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: componentName },
      queryParamsHandling: 'merge'
    });
  }

  // Método para obtener el ícono según la opción del menú
  private getIconByMenuOption(option: MenuOptionsEnum): string {
    switch (option) {
      case MenuOptionsEnum.Personas:
        return 'pi pi-fw pi-users';
      case MenuOptionsEnum.Areas:
        return 'pi pi-fw pi-sitemap';
      case MenuOptionsEnum.Cargos:
        return 'pi pi-fw pi-briefcase';
      case MenuOptionsEnum.Usuarios:
        return 'pi pi-fw pi-user';
      case MenuOptionsEnum.TipoDocumentos:
        return 'pi pi-fw pi-file';
      case MenuOptionsEnum.Plantillas:
        return 'pi pi-fw pi-file-edit';
      default:
        return '';
    }
  }

}