import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentShowComponent } from './component-show.component';

describe('ComponentShowComponent', () => {
  let component: ComponentShowComponent;
  let fixture: ComponentFixture<ComponentShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
