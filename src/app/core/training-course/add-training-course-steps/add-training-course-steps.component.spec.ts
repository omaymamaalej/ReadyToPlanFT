import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainingCourseStepsComponent } from './add-training-course-steps.component';

describe('AddTrainingCourseStepsComponent', () => {
  let component: AddTrainingCourseStepsComponent;
  let fixture: ComponentFixture<AddTrainingCourseStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTrainingCourseStepsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTrainingCourseStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
