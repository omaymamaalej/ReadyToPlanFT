import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Languages } from 'src/app/enumerations/languages.enum';
import { Level } from 'src/app/enumerations/level.enum';
import { LocationType } from 'src/app/enumerations/locationType.enum';
import { StudyClass } from 'src/app/enumerations/studyClass.enum';
import { TrainingCourseDto } from 'src/app/models/training-course';
import { TrainingCourseService } from 'src/app/services/training-course.service';

@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.css']
})
export class CourseContentComponent implements OnInit {

  @Input() form!: FormGroup;


  studyClasses = Object.entries(StudyClass);
  levels = Object.entries(Level);
  locationTypes = Object.entries(LocationType);
  languages = Object.entries(Languages);

  savedCourse: any = null; 

  constructor(private trainingCourseService: TrainingCourseService) { }

  ngOnInit(): void {
    // Ajouter dynamiquement les validateurs selon le targetAudience
    this.form.get('targetAudience')?.valueChanges.subscribe(value => {
      const instructorControl = this.form.get('instructor');
      const locationControl = this.form.get('locationType');
      const durationControl = this.form.get('duration');
      const studyClassControl = this.form.get('studyClass');
      const levelControl = this.form.get('level');
      const languagesControl = this.form.get('languages');

      // STUDENTS n'ont pas besoin de certains champs
      if (value === 'STUDENTS') {
        instructorControl?.clearValidators();
        locationControl?.clearValidators();
        durationControl?.clearValidators();
      } else {
        instructorControl?.setValidators([Validators.required]);
        locationControl?.setValidators([Validators.required]);
        durationControl?.setValidators([Validators.required]);
      }

      studyClassControl?.setValidators([Validators.required]);
      levelControl?.setValidators([Validators.required]);
      languagesControl?.setValidators([Validators.required]);

      // Mettre à jour la validité
      instructorControl?.updateValueAndValidity();
      locationControl?.updateValueAndValidity();
      durationControl?.updateValueAndValidity();
      studyClassControl?.updateValueAndValidity();
      levelControl?.updateValueAndValidity();
      languagesControl?.updateValueAndValidity();
    });
  }

  allRequiredFilled(): boolean {
    const form = this.form;
    const target = form.get('targetAudience')?.value;
    if (!form.get('studyClass')?.value || !form.get('level')?.value || !form.get('languages')?.value) return false;
    if (target !== 'STUDENTS') {
      if (!form.get('instructor')?.value || !form.get('duration')?.value || !form.get('locationType')?.value) return false;
    }
    return true;
  }

  saveCourse() {
    if (this.form.valid) {
      const courseData: TrainingCourseDto = this.form.getRawValue(); 

      this.trainingCourseService.createWithoutPresentation(courseData).subscribe({
        next: (response) => {
          console.log('Course saved without presentation:', response);
          this.savedCourse = response; 
        },
        error: (err) => {
          console.error('Error saving course:', err);
        }
      });
    }
  }

}