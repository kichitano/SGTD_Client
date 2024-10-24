import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleNewEditComponent } from './people-new-edit.component';

describe('PeopleNewEditComponent', () => {
  let component: PeopleNewEditComponent;
  let fixture: ComponentFixture<PeopleNewEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleNewEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleNewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
