import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentTypeNewEditComponent } from './document-type-new-edit.component';

describe('ComponentNewEditComponent', () => {
  let component: DocumentTypeNewEditComponent;
  let fixture: ComponentFixture<DocumentTypeNewEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentTypeNewEditComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DocumentTypeNewEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
