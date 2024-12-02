import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypeShowComponent } from './document-type-show.component';

describe('ComponentShowComponent', () => {
  let component: DocumentTypeShowComponent;
  let fixture: ComponentFixture<DocumentTypeShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentTypeShowComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DocumentTypeShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
