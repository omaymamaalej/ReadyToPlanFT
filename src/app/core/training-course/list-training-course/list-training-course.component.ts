import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingCourseService } from 'src/app/services/training-course.service';
import { PresentationDialogComponent } from '../presentation-dialog/presentation-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { CommunicationService } from 'src/app/services/communication.service';

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
    private dialogService: NbDialogService,
    private communicationService: CommunicationService
  ) { }

  ngOnInit(): void {
    this.getAllTrainingCourses();
  }


  getAllTrainingCourses() {
    this.loading = true;
    this.trainingService.getMyCourses().subscribe({
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
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Training Course',
        message: 'Are you sure you want to delete this training course? This action cannot be undone.',
        confirmText: 'Yes, Delete',
        cancelText: 'Cancel',
        icon: 'trash-2-outline',
        status: 'danger'
      }
    }).onClose.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.trainingService.delete(id).subscribe({
          next: () => this.getAllTrainingCourses(),
          error: (err) => console.error(err)
        });
      }
    });
  }

  viewPresentation(course: any) {
    course.loadingPresentation = true;

    this.trainingService.getPresentation(course.id).subscribe({
      next: (presentation: string) => {
        course.loadingPresentation = false;
        this.dialogService.open(PresentationDialogComponent, {
          context: { presentationText: presentation },
          autoFocus: true,
          closeOnBackdropClick: true,
        });
      },
      error: (err) => {
        course.loadingPresentation = false;
        console.error(err);
        alert("Impossible de récupérer la présentation.");
      }
    });
  }

  regeneratePresentation(course: any) {
    course.loadingPresentation = true;
    this.trainingService.regeneratePresentation(course.id).subscribe({
      next: (newPresentation: string) => {
        course.loadingPresentation = false;
        const dialogRef = this.dialogService.open(PresentationDialogComponent, {
          context: { presentationText: newPresentation, isTemporary: true },
          autoFocus: true, closeOnBackdropClick: false,
        }); dialogRef.onClose.subscribe((save: boolean) => {
          if (save) {
            this.trainingService.savePresentation(course.id, newPresentation).subscribe({
              next: (updatedCourse) => {
                course.presentation = updatedCourse.presentation;
                this.dialogService.open(AlertDialogComponent, {
                  context: {
                    title: 'Presentation Saved',
                    message: 'The regenerated presentation has been successfully saved! 🎉',
                    icon: 'checkmark-circle-2-outline',
                    status: 'success'
                  }
                });

              }, error: (err) => {
                console.error(err);
                this.dialogService.open(AlertDialogComponent, {
                  context: {
                    title: 'Save Failed',
                    message: 'We were unable to save the presentation. Please try again later.',
                    icon: 'close-circle-outline',
                    status: 'danger'
                  }
                });
              }
            });
          }
        });
      }, error: (err) => {
        course.loadingPresentation = false;
        console.error(err);
        this.dialogService.open(AlertDialogComponent, {
          context: {
            title: 'Generation Failed',
            message: 'We could not generate a new presentation at this time. Please try again later.',
            icon: 'alert-triangle-outline',
            status: 'warning'
          }
        });
      }
    });
  }

  evaluateCourse(id: string, satisfaction: number) {
    this.trainingService.evaluate(id, satisfaction).subscribe({
      next: () => {
        this.getAllTrainingCourses();
        this.communicationService.notifyStatsUpdate(); // ← Notifier la mise à jour
        this.showEvaluationNotification(satisfaction);
      },
      error: (err) => console.error(err)
    });
  }

  togglePublic(id: string, isPublic: boolean) {
    this.trainingService.setPublic(id, isPublic).subscribe({
      next: () => {
        this.getAllTrainingCourses();
        this.communicationService.notifyStatsUpdate();

        // Notifier qu'une présentation a été partagée
        const course = this.trainingCourses.find(c => c.id === id);
        if (course && isPublic) {
          this.communicationService.notifyPresentationShared(course);
          this.showSharingNotification(course);
        }
      },
      error: (err) => console.error(err)
    });
  }

  private showEvaluationNotification(satisfaction: number) {
    const message = satisfaction === 3
      ? '✅ Course rated as Satisfied!'
      : '❌ Course rated as Not Satisfied!';

    this.dialogService.open(AlertDialogComponent, {
      context: {
        title: 'Evaluation Submitted',
        message: message,
        icon: satisfaction === 3 ? 'smiling-face-outline' : 'frown-outline',
        status: satisfaction === 3 ? 'success' : 'warning'
      }
    });
  }

  private showSharingNotification(course: any) {
    this.dialogService.open(AlertDialogComponent, {
      context: {
        title: 'Presentation Shared',
        message: `"${course.title}" is now public and available in the dashboard!`,
        icon: 'unlock-outline',
        status: 'info'
      }
    });
  }
}



