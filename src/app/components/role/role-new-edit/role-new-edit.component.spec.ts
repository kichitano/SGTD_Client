import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleNewEditComponent } from './role-new-edit.component';

describe('RoleNewEditComponent', () => {
  let component: RoleNewEditComponent;
  let fixture: ComponentFixture<RoleNewEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleNewEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleNewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
