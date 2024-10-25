import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaNewEditComponent } from './area-new-edit.component';

describe('AreaNewEditComponent', () => {
  let component: AreaNewEditComponent;
  let fixture: ComponentFixture<AreaNewEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaNewEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaNewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
