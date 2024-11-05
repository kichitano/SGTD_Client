import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionShowPositionChartComponent } from './position-show-position-chart.component';

describe('PositionShowPositionChartComponent', () => {
  let component: PositionShowPositionChartComponent;
  let fixture: ComponentFixture<PositionShowPositionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionShowPositionChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionShowPositionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
