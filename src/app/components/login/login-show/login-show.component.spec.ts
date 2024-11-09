import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginShowComponent } from './login-show.component';

describe('LoginShowComponent', () => {
  let component: LoginShowComponent;
  let fixture: ComponentFixture<LoginShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
