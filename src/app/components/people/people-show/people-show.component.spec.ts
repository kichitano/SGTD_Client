import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleShowComponent } from './people-show.component';

describe('PeopleShowComponent', () => {
  let component: PeopleShowComponent;
  let fixture: ComponentFixture<PeopleShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleShowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
