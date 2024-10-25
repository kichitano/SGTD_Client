import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaShowOrganizationChartComponent } from './area-show-organization-chart.component';

describe('AreaShowOrganizationChartComponent', () => {
  let component: AreaShowOrganizationChartComponent;
  let fixture: ComponentFixture<AreaShowOrganizationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaShowOrganizationChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaShowOrganizationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
