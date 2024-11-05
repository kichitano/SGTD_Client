import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentNewEditComponent } from './component-new-edit.component';

describe('ComponentNewEditComponent', () => {
  let component: ComponentNewEditComponent;
  let fixture: ComponentFixture<ComponentNewEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentNewEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentNewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
