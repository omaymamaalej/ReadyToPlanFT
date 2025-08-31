import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTrainingCourseComponent } from './list-training-course.component';

describe('ListTrainingCourseComponent', () => {
  let component: ListTrainingCourseComponent;
  let fixture: ComponentFixture<ListTrainingCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTrainingCourseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTrainingCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
