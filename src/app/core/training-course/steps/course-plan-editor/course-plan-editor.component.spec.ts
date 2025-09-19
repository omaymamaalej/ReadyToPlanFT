import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursePlanEditorComponent } from './course-plan-editor.component';

describe('CoursePlanEditorComponent', () => {
  let component: CoursePlanEditorComponent;
  let fixture: ComponentFixture<CoursePlanEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoursePlanEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoursePlanEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
