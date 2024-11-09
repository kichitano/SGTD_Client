import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { Subject, takeUntil } from 'rxjs';
import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { AreaModel } from '../../area/area.model';
import { AreaService } from '../../area/area.service';
import { PositionModel } from '../position.model';
import { PositionService } from '../position.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-position-show-position-chart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    FloatLabelModule,
    DividerModule,
    OrganizationChartModule,
    AutoCompleteModule
  ],
  templateUrl: './position-show-position-chart.component.html',
  styleUrl: './position-show-position-chart.component.scss'
})

export class PositionShowPositionChartComponent {
  unsubscribe$ = new Subject<void>();
  visible = false;
  data: TreeNode[] = [];
  positions: PositionModel[] = [];

  areas: AreaModel[] = [];
  filteredAreas: AreaModel[] = [];
  selectedArea: AreaModel | undefined;

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly positionService: PositionService,
    private readonly areaService: AreaService
  ) { }

  showDialog() {
    this.loadAreas();
    this.visible = true;
  }

  hideDialog() {
    this.selectedArea = undefined;
    this.visible = false;
    this.data = [];
    this.positions = [];
  }

  private loadAreas() {
    this.spinnerPrimeNgService
      .use(this.areaService.getAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.areas = res;
        }
      });
  }

  loadPositionsByAreaId(areaId: number) {
    this.spinnerPrimeNgService
      .use(this.positionService.getAllByAreaIdAsync(areaId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.positions = res;
          this.buildOrganizationChart();
        }
      });
  }

  private buildOrganizationChart() {
    const rootPositions = this.positions.filter(position => !position.parentPositionId);
    this.data = rootPositions.map(position => this.createNode(position));
  }

  private createNode(position: PositionModel): TreeNode {
    return {
      label: position.name,
      type: 'area',
      styleClass: 'area-node',
      expanded: true,
      data: {
        name: position.name,
        description: position.description,
      },
      children: this.getChildNodes(position.id)
    };
  }

  private getChildNodes(parentId: number): TreeNode[] {
    const children = this.positions.filter(position => position.parentPositionId === parentId);
    return children.map(child => this.createNode(child));
  }

  filterArea(event: { query: string }) {
    const filtered: AreaModel[] = [];
    const query = event.query.toLowerCase();

    for (const area of this.areas) {
      if (area.name.toLowerCase().includes(query)) {
        filtered.push(area);
      }
    }

    this.filteredAreas = filtered;
  }

}
