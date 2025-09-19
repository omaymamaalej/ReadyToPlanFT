import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Languages } from 'src/app/enumerations/languages.enum';
import { Level } from 'src/app/enumerations/level.enum';
import { LocationType } from 'src/app/enumerations/locationType.enum';
import { StudyClass } from 'src/app/enumerations/studyClass.enum';
import { TargetAudience } from 'src/app/enumerations/targetAudience.enum';

@Component({
  selector: 'app-add-training-course-steps',
  templateUrl: './add-training-course-steps.component.html',
  styleUrls: ['./add-training-course-steps.component.css']
})
export class AddTrainingCourseStepsComponent implements OnInit {

  trainingCourseForm!: FormGroup;

  targetAudiences = Object.entries(TargetAudience);
  studyClasses = Object.entries(StudyClass);
  levels = Object.entries(Level);
  locationTypes = Object.entries(LocationType);
  languages = Object.entries(Languages);

  constructor(private fb: FormBuilder) {
    this.trainingCourseForm = this.fb.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      targetAudience: [null, Validators.required],
      studyClass: [null],
      level: [null],
      instructor: [''],
      duration: [''],
      locationType: [null],
      languages: [null],
    });
  }

  ngOnInit(): void {}
}