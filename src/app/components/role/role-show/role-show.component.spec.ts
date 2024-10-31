import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleShowComponent } from './role-show.component';

describe('RoleShowComponent', () => {
  let component: RoleShowComponent;
  let fixture: ComponentFixture<RoleShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
