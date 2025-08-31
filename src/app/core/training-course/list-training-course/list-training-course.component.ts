import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingCourseService } from 'src/app/services/training-course.service';
import { PresentationDialogComponent } from '../presentation-dialog/presentation-dialog.component';
import { NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-list-training-course',
  templateUrl: './list-training-course.component.html',
  styleUrls: ['./list-training-course.component.css']
})
export class ListTrainingCourseComponent implements OnInit {

  trainingCourses: any[] = [];
  loading = true;

  constructor(
    private trainingService: TrainingCourseService,
    private router: Router,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.getAllTrainingCourses();
  }

  getAllTrainingCourses() {
    this.loading = true;
    this.trainingService.getAll().subscribe({
      next: (data) => {
        this.trainingCourses = data;
        this.trainingCourses.forEach(course => course.showFullSummary = false);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  toggleSummary(course: any, event: Event) {
    event.preventDefault();
    if (course.summary && course.summary.length > 40) {
      course.showFullSummary = !course.showFullSummary;
    }
  }

  editCourse(id: any) {
    this.router.navigate(['/trainingCourse/edit', id]);
  }

  deleteCourse(id: any) {
    if (confirm('Voulez-vous vraiment supprimer cette formation ?')) {
      this.trainingService.delete(id).subscribe({
        next: () => this.getAllTrainingCourses(),
        error: (err) => console.error(err)
      });
    }
  }

  viewPresentation(course: any) {
    this.trainingService.getPresentation(course.id).subscribe({
      next: (presentation: string) => {
        this.dialogService.open(PresentationDialogComponent, {
          context: { presentationText: presentation },
          autoFocus: true,
          closeOnBackdropClick: true,
        });
      },
      error: (err) => {
        console.error(err);
        alert("Impossible de récupérer la présentation.");
      }
    });
  }

}
