import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainingCourseComponent } from './add-training-course.component';

describe('AddTrainingCourseComponent', () => {
  let component: AddTrainingCourseComponent;
  let fixture: ComponentFixture<AddTrainingCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTrainingCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTrainingCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
