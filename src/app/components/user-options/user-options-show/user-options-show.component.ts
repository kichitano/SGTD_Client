import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UserMenuOptionsEnum } from '../../panel/panel.model';
import { PanelShowComponent } from '../../panel/panel-show/panel-show.component';
import { ComponentLoaderService } from '../../../../shared/services/ComponentLoader.service';

@Component({
  selector: 'app-user-options-show',
  standalone: true,
  imports: [],
  templateUrl: './user-options-show.component.html',
  styleUrl: './user-options-show.component.scss'
})
export class UserOptionsShowComponent implements OnInit {

  @ViewChild('dynamicComponentContainer', { read: ViewContainerRef, static: true })
  containerRef!: ViewContainerRef;

  @ViewChild(PanelShowComponent, { static: false }) panelShowComponent!: PanelShowComponent;

  constructor(private readonly componentLoader: ComponentLoaderService) {}

  ngOnInit(): void {
    this.componentLoader.currentComponent$.subscribe(component => {
      if (component) {
        this.containerRef.clear();
        this.containerRef.createComponent(component);
      }
    });
  }


  loadFilesComponent() {
    if (this.panelShowComponent) {
      this.componentLoader.loadComponent(UserMenuOptionsEnum.ArchivosUsuario);
    } else {
      console.error('PanelShowComponent no está disponible');
    }
  }
}
