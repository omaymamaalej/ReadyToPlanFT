import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Languages } from 'src/app/enumerations/languages.enum';
import { Level } from 'src/app/enumerations/level.enum';
import { LocationType } from 'src/app/enumerations/locationType.enum';
import { StudyClass } from 'src/app/enumerations/studyClass.enum';
import { TargetAudience } from 'src/app/enumerations/targetAudience.enum';
import { TrainingCourseService } from 'src/app/services/training-course.service';
import { NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {

  @Input() courseData: any;

  editMode = false;
  courseForm!: FormGroup;
  originalData: any;
  generatingPlan = false;
  coursePlan: string = '';
  showPlanModal = false;

  savedCoursePlan: string = '';
  savedCoursePlanSafe: SafeHtml = '';
  showSavedPlanModal = false;
  hasSavedPlan = false;

  targetAudiences = Object.entries(TargetAudience);
  studyClasses = Object.entries(StudyClass);
  levels = Object.entries(Level);
  locationTypes = Object.entries(LocationType);
  languages = Object.entries(Languages);

  showExtraFields: boolean = false;

  editModePlan = false;
  editedPlan: string = '';

  constructor(
    private fb: FormBuilder,
    private courseService: TrainingCourseService,
    private toastrService: NbToastrService,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCoursePlan();
  }

  initForm() {
    this.courseForm = this.fb.group({
      title: [this.courseData?.title || '', Validators.required],
      summary: [this.courseData?.summary || ''],
      targetAudience: [this.courseData?.targetAudience || ''],
      studyClass: [this.courseData?.studyClass || ''],
      level: [this.courseData?.level || ''],
      instructor: [this.courseData?.instructor || ''],
      duration: [this.courseData?.duration || ''],
      locationType: [this.courseData?.locationType || ''],
      languages: [this.courseData?.languages || '']
    });

    this.showExtraFields = this.courseForm.get('targetAudience')?.value !== 'STUDENTS';

    this.courseForm.get('targetAudience')?.valueChanges.subscribe(value => {
      if (this.editMode) {
        this.showExtraFields = value !== 'STUDENTS';

        if (value === 'STUDENTS') {
          this.courseForm.patchValue({
            instructor: '',
            duration: '',
            locationType: ''
          });
        }
      }
    });
  }

  // Charger le plan existant
  loadCoursePlan() {
    this.courseService.getCoursePlan(this.courseData.id).subscribe({
      next: (plan) => {

        console.log('Plan loaded from server:', plan);

        this.savedCoursePlan = plan;
        this.editedPlan = plan;

        this.hasSavedPlan = !!plan && plan !== '<p>Plan non généré</p>' && !plan.includes('Erreur');

        if (this.hasSavedPlan) {
          console.log('Plan sauvegardé chargé avec succès');
          setTimeout(() => this.applyPlanStyles(), 100);
        } else {
          console.log('Aucun plan sauvegardé trouvé');
        }

        this.cdRef.detectChanges(); // Force la détection de changement

      },
      error: (err) => {
        console.log('Aucun plan existant ou erreur de chargement');
        this.hasSavedPlan = false;
        this.editedPlan = ''; // Initialiser à vide en cas d'erreur
        this.savedCoursePlan = '';
        this.savedCoursePlanSafe = this.sanitizer.bypassSecurityTrustHtml('');
      }
    });
  }

  // Générer un nouveau plan
  generateCoursePlan() {
    this.generatingPlan = true;

    this.courseService.regenerateCoursePlan(this.courseData.id).subscribe({
      next: (newPlan) => {
        this.coursePlan = newPlan;
        this.showPlanModal = true;
        this.generatingPlan = false;
        this.toastrService.success('Plan généré avec succès!', 'Succès', {
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Erreur lors de la génération du plan', err);
        this.generatingPlan = false;
        this.toastrService.danger('Erreur lors de la génération du plan', 'Erreur', {
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          duration: 5000
        });
      }
    });
  }

  // Voir le plan sauvegardé
  viewSavedPlan() {
    if (this.hasSavedPlan) {
      this.refreshSavedPlanDisplay(); 
      this.showSavedPlanModal = true;
    } else {
      this.toastrService.warning('Aucun plan sauvegardé trouvé', 'Information', {
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        duration: 3000
      });
    }
  }

  saveCoursePlan() {
    this.courseService.saveCoursePlan(this.courseData.id, this.coursePlan).subscribe({
      next: (updatedCourse) => {

        console.log('Plan saved successfully:', updatedCourse);

        this.courseData = updatedCourse;
        this.savedCoursePlan = this.coursePlan; // Mettre à jour le plan sauvegardé
        this.savedCoursePlanSafe = this.sanitizer.bypassSecurityTrustHtml(this.coursePlan);
        this.hasSavedPlan = true;
        this.showPlanModal = false;

        this.toastrService.success('Plan sauvegardé avec succès!', 'Succès', {
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          duration: 3000
        });

        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error saving plan:', err);
        this.toastrService.danger('Erreur lors de la sauvegarde du plan', 'Erreur', {
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          duration: 5000
        });
      }
    });
  }

  // Dans la classe CourseDetailsComponent
  ngAfterViewInit() {
    this.applyPlanStyles();
  }

  private applyPlanStyles() {
    const style = document.createElement('style');
    style.textContent = `
    .modern-course-plan {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 1000px;
      margin: 0 auto;
      padding: 30px;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }
    
    .plan-header {
      margin-bottom: 30px;
      padding: 0 0 20px 0;
      border-bottom: 2px solid #e9ecef;
      text-align: left;
    }
    
    .plan-header h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
      font-weight: 700;
      color: #2c3e50;
      line-height: 1.3;
    }
    
    .total-duration {
      margin: 0;
      font-size: 18px;
      color: #666;
      font-weight: 500;
      background: #e3f2fd;
      padding: 8px 16px;
      border-radius: 20px;
      display: inline-block;
    }
    
    .chapter {
      padding: 25px;
      border-radius: 12px;
      background: #f8f9fa;
      border-left: 5px solid #4facfe;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
      transition: all 0.3s ease;
      margin-left: 0;
      text-align: left;
    }
    
    .chapter:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      background: #ffffff;
    }
    
    .chapter-title {
      margin: 0 0 15px 0;
      font-size: 22px;
      font-weight: 700;
      color: #2c3e50;
      display: flex;
      align-items: center;
      gap: 15px;
      flex-wrap: wrap;
    }
    
    .chapter-number {
      background: #4facfe;
      color: white;
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 14px;
      min-width: 80px;
      text-align: center;
      box-shadow: 0 2px 6px rgba(79, 172, 254, 0.3);
    }
    
    .chapter-duration {
      font-size: 16px;
      margin-bottom: 20px;
      color: #5a6169;
      background: #e3f2fd;
      padding: 8px 16px;
      border-radius: 20px;
      display: inline-block;
      font-weight: 500;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }
    
    .subtopic {
      margin: 10px 0;
      padding: 8px 12px;
      color: #4a5568;
      background: #ffffff;
      border-radius: 6px;
      font-size: 15px;
      border-left: 3px solid #4facfe;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }
    
    .subtopic:hover {
      background: #f1f8ff;
      transform: translateX(5px);
    }
  `;
    document.head.appendChild(style);
  }

  toggleEdit() {
    if (!this.editMode) {
      this.originalData = { ...this.courseData };
      this.initForm();
    }
    this.editMode = !this.editMode;
  }

  cancelEdit() {
    this.courseData = { ...this.originalData };
    this.editMode = false;
    this.showExtraFields = this.courseData.targetAudience !== 'STUDENTS';
  }

  saveChanges() {
    if (this.courseForm.valid) {
      const updatedCourse = {
        ...this.courseData,
        ...this.courseForm.value,
        id: this.courseData.id
      };

      if (updatedCourse.targetAudience === 'STUDENTS') {
        updatedCourse.instructor = '';
        updatedCourse.duration = '';
        updatedCourse.locationType = '';
      }

      this.courseService.update(updatedCourse).subscribe({
        next: (res) => {
          this.courseData = res;
          this.editMode = false;
          this.showExtraFields = this.courseData.targetAudience !== 'STUDENTS';
        },
        error: (err) => console.error('Erreur lors de la mise à jour', err)
      });
    }
  }


  // Ajoutez ces méthodes
  toggleEditPlan() {
    this.editModePlan = !this.editModePlan;
    if (this.editModePlan) {
      this.editedPlan = this.coursePlan;
    }
  }

  onPlanUpdated(updatedPlan: string) {
    this.editedPlan = updatedPlan;
    this.savedCoursePlan = updatedPlan;
    this.savedCoursePlanSafe = this.sanitizer.bypassSecurityTrustHtml(updatedPlan);
  }

  // Dans saveEditedPlan, utilisez bien editedPlan
  saveEditedPlan() {
    console.log('Saving edited plan:', this.editedPlan);

    if (!this.editedPlan || this.editedPlan.trim() === '') {
      this.toastrService.warning('Aucun plan à sauvegarder', 'Attention', {
        position: NbGlobalPhysicalPosition.TOP_RIGHT,
        duration: 3000
      });
      return;
    }

    this.courseService.saveCoursePlan(this.courseData.id, this.editedPlan).subscribe({
      next: (updatedCourse) => {
        console.log('Plan saved successfully:', updatedCourse);

        // Mettre à jour les données locales CORRECTEMENT
        this.savedCoursePlan = this.editedPlan; // ← C'EST LA LIGNE CLÉ
        this.savedCoursePlanSafe = this.sanitizer.bypassSecurityTrustHtml(this.editedPlan);
        this.hasSavedPlan = true;
        this.editModePlan = false;

        this.toastrService.success('Plan modifié sauvegardé!', 'Succès', {
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          duration: 3000
        });

        // Forcer le rafraîchissement de l'affichage
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Erreur sauvegarde plan modifié', err);
        this.toastrService.danger('Erreur sauvegarde plan modifié', 'Erreur', {
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          duration: 5000
        });
      }
    });
  }

  refreshSavedPlanDisplay() {
    this.savedCoursePlanSafe = this.sanitizer.bypassSecurityTrustHtml(this.savedCoursePlan);

    // Réappliquer les styles
    setTimeout(() => {
      this.applyPlanStyles();
      this.cdRef.detectChanges();
    }, 100);
  }


  regenerateAdaptedPlan() {
    this.generatingPlan = true;

    this.courseService.regenerateAdaptedCoursePlan(
      this.courseData.id,
      this.editedPlan
    ).subscribe({
      next: (newPlan) => {
        this.editedPlan = newPlan;
        this.generatingPlan = false;
        this.toastrService.success('Plan adapté régénéré!', 'Succès', {
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          duration: 3000
        });
      },
      error: (err) => {
        console.error('Erreur régénération plan adapté', err);
        this.generatingPlan = false;
        this.toastrService.danger('Erreur régénération plan adapté', 'Erreur', {
          position: NbGlobalPhysicalPosition.TOP_RIGHT,
          duration: 5000
        });
      }
    });
  }

  // Méthode pour éditer le plan sauvegardé
  editSavedPlan() {
    this.editedPlan = this.savedCoursePlan; // Charger le plan sauvegardé dans l'éditeur
    this.showSavedPlanModal = false; // Fermer la modal de visualisation
    this.editModePlan = true; // Ouvrir la modal d'édition
  }
}