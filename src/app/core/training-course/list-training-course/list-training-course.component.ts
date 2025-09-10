import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TrainingCourseService } from 'src/app/services/training-course.service';
import { PresentationDialogComponent } from '../presentation-dialog/presentation-dialog.component';
import { NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { CommunicationService } from 'src/app/services/communication.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-training-course',
  templateUrl: './list-training-course.component.html',
  styleUrls: ['./list-training-course.component.css']
})
export class ListTrainingCourseComponent implements OnInit {

  trainingCourses: any[] = [];
  filteredCourses: any[] = [];

  favorites: string[] = [];
  loading = true;

  // 🔎 Filtres
  searchTerm: string = '';
  selectedAudience: string = '';
  selectedLevel: string = '';

  // Pagination
  currentPage: number = 1;      
  itemsPerPage: number = 5;     
  pagedCourses: any[] = [];     
  totalPages: number = 0;       

  constructor(
    private trainingService: TrainingCourseService,
    private router: Router,
    private dialogService: NbDialogService,
    private communicationService: CommunicationService
  ) { }

  ngOnInit() {
    this.loading = true;

    forkJoin({
      courses: this.trainingService.getMyCourses(),
      favorites: this.trainingService.getFavorites()
    }).subscribe({
      next: ({ courses, favorites }) => {
        this.trainingCourses = courses.map(course => ({
          ...course,
          showFullSummary: false,
          isFavorite: favorites.includes(course.id),

          userSatisfaction: course.userSatisfaction || 0
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });

    this.communicationService.favoriteCourses$.subscribe((favCourses) => {
      this.trainingCourses.forEach(course => {
        course.isFavorite = !!favCourses.find(f => f.id === course.id);
      });
      this.applyFilters();
    });
  }

  getAllTrainingCourses() {
    this.loading = true;
    this.trainingService.getMyCourses().subscribe({
      next: (data) => {
        this.trainingCourses = data.map(course => ({
          ...course,
          showFullSummary: false,
          userSatisfaction: course.userSatisfaction || null
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadFavorites() {
    this.trainingService.getFavorites().subscribe({
      next: (favIds: string[]) => {
        this.trainingCourses.forEach(course => {
          course.isFavorite = favIds.includes(course.id);
        });
      },
      error: err => console.error(err)
    });
  }

  /**
   * Charge les cours et la liste des favoris, puis synchronise les favoris avec les cours
   */
  loadFavoritesAndCourses() {
    this.loading = true;
    this.trainingService.getFavorites().subscribe({
      next: (favIds: string[]) => {

        this.trainingService.getMyCourses().subscribe({
          next: (data) => {
            this.trainingCourses = data;
            this.trainingCourses.forEach(course => {
              course.showFullSummary = false;
              course.isFavorite = favIds.includes(course.id);
            });

            const favCourses = this.trainingCourses.filter(course => course.isFavorite);

            this.loading = false;
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
          }
        });
      },
      error: err => {
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

  evaluateCourse(courseId: string, satisfaction: number) {
    this.trainingService.evaluate(courseId, satisfaction).subscribe({
      next: () => {
        const course = this.trainingCourses.find(c => c.id === courseId);
        if (course) {
          if (course.userSatisfaction === 3) {
            course.satisfiedCount--;
          } else if (course.userSatisfaction === 1) {
            course.notSatisfiedCount--;
          }

          if (satisfaction === 3) {
            course.satisfiedCount++;
          } else if (satisfaction === 1) {
            course.notSatisfiedCount++;
          }

          course.userSatisfaction = satisfaction;
        }

        this.communicationService.notifyStatsUpdate();
      },
      error: (err) => console.error(err)
    });
  }

  togglePublic(id: string, isPublic: boolean) {
    this.trainingService.setPublic(id, isPublic).subscribe({
      next: () => {
        this.getAllTrainingCourses();
        this.communicationService.notifyStatsUpdate();

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

  toggleFavorite(course: any) {
    this.trainingService.toggleFavorite(course.id).subscribe({
      next: (isFav: boolean) => {
        course.isFavorite = isFav;

        if (isFav) {
          this.communicationService.addFavorite(course);
        } else {
          this.communicationService.removeFavorite(course.id);
        }
      },
      error: err => console.error(err)
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

   // 🔥 Nouvelle méthode pour appliquer les filtres
  applyFilters() {
    this.filteredCourses = this.trainingCourses.filter(course => {
      let matchesSearch = true;
      let matchesAudience = true;
      let matchesLevel = true;

      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase();
        matchesSearch =
          course.title?.toLowerCase().includes(term) ||
          course.instructor?.toLowerCase().includes(term);
      }

      if (this.selectedAudience) {
        matchesAudience = course.targetAudience === this.selectedAudience;
      }

      if (this.selectedLevel) {
        matchesLevel = course.level === this.selectedLevel;
      }

      return matchesSearch && matchesAudience && matchesLevel;
    });

    this.currentPage = 1; // revenir à la première page après filtrage
    this.updatePagedCourses();
  }

  updatePagedCourses() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedCourses = this.filteredCourses.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.filteredCourses.length / this.itemsPerPage);
    console.log('pagedCourses', this.pagedCourses, 'totalPages', this.totalPages);
  }


  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedCourses();
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }


}