import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { TrainingCourseService } from './training-course.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private statsUpdated = new Subject<void>();
  private presentationShared = new Subject<any>();
  private favoriteCoursesSubject = new BehaviorSubject<any[]>([]);

  private courseEvaluated = new Subject<{ courseId: string, satisfaction: number }>();
  courseEvaluated$ = this.courseEvaluated.asObservable();

  notifyCourseEvaluated(courseId: string, satisfaction: number) {
    this.courseEvaluated.next({ courseId, satisfaction });
  }


  favoriteCourses$ = this.favoriteCoursesSubject.asObservable();
  statsUpdated$ = this.statsUpdated.asObservable();
  presentationShared$ = this.presentationShared.asObservable();

  constructor(
    private trainingService: TrainingCourseService,
    private tokenStorage: TokenStorageService
  ) {
    this.initializeFavorites();
  }

  // Initialiser les favoris au démarrage
  private initializeFavorites() {

    // Écouter les changements d'état de connexion
    this.tokenStorage.loggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadFavoritesFromServer();
      } else {
        this.favoriteCoursesSubject.next([]);
      }
    });
  }

  private loadFavoritesFromServer() {
    this.trainingService.getFavorites().subscribe({
      next: (favIds: string[]) => {
        if (!favIds || favIds.length === 0) {
          this.favoriteCoursesSubject.next([]);
          return;
        }

        // Récupérer tous les cours publics et les cours de l'utilisateur
        this.trainingService.getPublicCoursesWithSatisfaction().subscribe({
          next: (publicCourses) => {
            this.trainingService.getMyCourses().subscribe({
              next: (myCourses) => {
                const allCourses = [...publicCourses, ...myCourses];

                const uniqueCourses = allCourses.filter((course, index, self) =>
                  index === self.findIndex(c => c.id === course.id)
                );

                const favCourses = uniqueCourses.filter(c => favIds.includes(c.id));

                this.favoriteCoursesSubject.next(favCourses);
              },
              error: err => console.error('Error loading my courses:', err)
            });
          },
          error: err => console.error('Error loading public courses:', err)
        });
      },
      error: err => console.error('Error loading favorites:', err)
    });
  }



  notifyStatsUpdate() {
    this.statsUpdated.next();
  }

  notifyPresentationShared(course: any) {
    this.presentationShared.next(course);
  }

  setFavorites(courses: any[]) {
    this.favoriteCoursesSubject.next(courses);
  }

  addFavorite(course: any) {
    const current = this.favoriteCoursesSubject.value;
    if (!current.find(c => c.id === course.id)) {
      this.favoriteCoursesSubject.next([...current, course]);
    }
  }

  removeFavorite(courseId: string) {
    const current = this.favoriteCoursesSubject.value;
    this.favoriteCoursesSubject.next(current.filter(c => c.id !== courseId));
  }

  refreshFavorites() {
    this.loadFavoritesFromServer();
  }
}