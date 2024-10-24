import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelShowComponent } from './panel-show.component';

describe('PanelShowComponent', () => {
  let component: PanelShowComponent;
  let fixture: ComponentFixture<PanelShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PanelShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
