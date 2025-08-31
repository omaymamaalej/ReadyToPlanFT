import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import PptxGenJS from 'pptxgenjs';

import { Languages } from 'src/app/enumerations/languages.enum';
import { Level } from 'src/app/enumerations/level.enum';
import { LocationType } from 'src/app/enumerations/locationType.enum';
import { StudyClass } from 'src/app/enumerations/studyClass.enum';
import { TargetAudience } from 'src/app/enumerations/targetAudience.enum';

import { TrainingCourseService } from 'src/app/services/training-course.service';
import { PresentationDialogComponent } from '../presentation-dialog/presentation-dialog.component';

@Component({
  selector: 'app-add-training-course',
  templateUrl: './add-training-course.component.html',
  styleUrls: ['./add-training-course.component.css']
})
export class AddTrainingCourseComponent implements OnInit {

  trainingCourseForm!: FormGroup;

  targetAudiences = Object.entries(TargetAudience);
  studyClasses = Object.entries(StudyClass);
  levels = Object.entries(Level);
  locationTypes = Object.entries(LocationType);
  languages = Object.entries(Languages);

  presentationText: string = ''; 

  constructor(
    private fb: FormBuilder,
    private trainingService: TrainingCourseService,
    private router: Router,
    private dialogService: NbDialogService
  ) {
    this.trainingCourseForm = this.fb.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      targetAudience: [null, Validators.required],
      instructor: [''],
      studyClass: [null, Validators.required],
      level: [null, Validators.required],
      locationType: [null],
      duration: [''],
      languages: [null, Validators.required],
    });
  }

  ngOnInit() {
    // Met à jour les validateurs dynamiquement
    this.trainingCourseForm.get('targetAudience')?.valueChanges.subscribe(value => {
      const instructorControl = this.trainingCourseForm.get('instructor');
      const locationControl = this.trainingCourseForm.get('locationType');
      const durationControl = this.trainingCourseForm.get('duration');

      if (value === 'STUDENTS') {
        instructorControl?.clearValidators();
        locationControl?.clearValidators();
        durationControl?.clearValidators();
      } else {
        instructorControl?.setValidators([Validators.required]);
        locationControl?.setValidators([Validators.required]);
        durationControl?.setValidators([Validators.required]);
      }

      instructorControl?.updateValueAndValidity();
      locationControl?.updateValueAndValidity();
      durationControl?.updateValueAndValidity();
    });
  }

  allRequiredFilled(): boolean {
    const form = this.trainingCourseForm;
    return !!(form.get('title')?.value && form.get('summary')?.value && form.get('targetAudience')?.value);
  }

  onSubmit() {
    this.trainingService.create(this.trainingCourseForm.value)
      .subscribe({
        next: (data) => {
          console.log('Course created with id:', data.id);

          if(data.presentation) {
            this.showPresentation(data.presentation);

          }
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  showPresentation(presentation: string) {
    this.dialogService.open(PresentationDialogComponent, {
      context: { presentationText: presentation },
      autoFocus: true,
      closeOnBackdropClick: true,
    });
  }

  downloadPresentation(text: string) {
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();

    slide.addText("Training Course Presentation", {
      x: 0.5, y: 0.25, w: 8, h: 0.5,
      fontSize: 24,
      bold: true,
      align: "center"
    });

    slide.addText(text, {
      x: 0.5, y: 1, w: 9, h: 5,
      fontSize: 18,
      color: "000000",
      wrap: true
    });

    pptx.writeFile({ fileName: "TrainingCourse_Presentation.pptx" });
  }

}
