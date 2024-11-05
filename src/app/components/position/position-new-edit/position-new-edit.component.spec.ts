import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionNewEditComponent } from './position-new-edit.component';

describe('PositionNewEditComponent', () => {
  let component: PositionNewEditComponent;
  let fixture: ComponentFixture<PositionNewEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PositionNewEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionNewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
