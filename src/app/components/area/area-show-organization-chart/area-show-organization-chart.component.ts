import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { Subject, takeUntil } from 'rxjs';
import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { AreaService } from '../area.service';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { TreeNode } from 'primeng/api';
import { AreaModel } from '../area.model';

@Component({
  selector: 'app-area-show-organization-chart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    DividerModule,
    OrganizationChartModule
  ],
  templateUrl: './area-show-organization-chart.component.html',
  styleUrl: './area-show-organization-chart.component.scss'
})
export class AreaShowOrganizationChartComponent {
  unsubscribe$ = new Subject<void>();
  visible = false;
  data: TreeNode[] = [];
  areas: AreaModel[] = [];

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly areaService: AreaService
  ) { }

  showDialog() {
    this.loadAreas();
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.data = [];
    this.areas = [];
  }

  private loadAreas() {
    this.spinnerPrimeNgService
      .use(this.areaService.GetAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.areas = res;
          this.buildOrganizationChart();
        }
      });
  }

  private buildOrganizationChart() {
    const rootAreas = this.areas.filter(area => !area.parentAreaId);
    this.data = rootAreas.map(area => this.createNode(area));
  }

  private createNode(area: AreaModel): TreeNode {
    return {
      label: area.name,
      type: 'area',
      styleClass: 'area-node',
      expanded: true,
      data: {
        name: area.name,
        description: area.description,
        status: area.status
      },
      children: this.getChildNodes(area.id)
    };
  }

  private getChildNodes(parentId: number): TreeNode[] {
    const children = this.areas.filter(area => area.parentAreaId === parentId);
    return children.map(child => this.createNode(child));
  }
}