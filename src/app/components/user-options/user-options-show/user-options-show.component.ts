import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UserMenuOptionsEnum } from '../../panel/panel.model';
import { ComponentLoaderService } from '../../../../shared/services/ComponentLoader.service';
import { Router } from '@angular/router';
import { FilesListComponent } from '../../files/files-list/files-list.component';

@Component({
  selector: 'app-user-options-show',
  standalone: true,
  imports: [
    FilesListComponent
  ],
  templateUrl: './user-options-show.component.html',
  styleUrl: './user-options-show.component.scss'
})
export class UserOptionsShowComponent {

  @ViewChild(FilesListComponent) filesListComponent!: FilesListComponent;


  constructor() { }


  showFilesListUser() {
    this.filesListComponent.showDialog();
  }
}
