import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOptionsShowComponent } from './user-options-show.component';

describe('UserOptionsShowComponent', () => {
  let component: UserOptionsShowComponent;
  let fixture: ComponentFixture<UserOptionsShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserOptionsShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserOptionsShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
