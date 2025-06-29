import { Component, HostListener, Inject, Input } from '@angular/core';
import { NB_DIALOG_CONFIG, NbDialogRef } from '@nebular/theme';
import { BusinessPlanFinalDTO } from 'src/app/models/BusinessPlanFinal';
import { Slide } from 'src/app/models/Slide';
import { BusinessPlanFinalService } from 'src/app/services/business-plan-final.service';

@Component({
  selector: 'app-business-plan-presentation-dialog',
  templateUrl: './business-plan-presentation-dialog.component.html',
  styleUrls: ['./business-plan-presentation-dialog.component.css']
})
export class BusinessPlanPresentationDialogComponent {

  plan: BusinessPlanFinalDTO;
  slides: Slide[] = [];
  currentSlideIndex = 0;
  isEditing = false;
  isLoading = true;
  errorMessage: string | null = null;
  private originalContent = '';
  modifiedSlides: Set<number> = new Set();

  constructor(
    @Inject(NB_DIALOG_CONFIG) public data: any,
    protected dialogRef: NbDialogRef<BusinessPlanPresentationDialogComponent>,
    private businessPlanService: BusinessPlanFinalService
  ) {
    this.plan = data.plan;
  }

  ngOnInit(): void {
    if (this.plan.finalContent) {
      this.parsePresentationContent(this.plan.finalContent);
      this.isLoading = false;
    } else {
      this.loadPresentation();
    }
  }

  private parsePresentationContent(content: string): void {
    const slideContents = content.split(/===SLIDE===\s*\n+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    this.slides = slideContents.map(content => ({ content }));
  }

  loadPresentation(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.businessPlanService.getPresentation(this.plan.id).subscribe({
      next: (slides: Slide[]) => {
        this.slides = slides;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = "Erreur de chargement de la présentation.";
        this.isLoading = false;
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isEditing) return;
    if (event.key === 'ArrowRight') this.nextSlide();
    if (event.key === 'ArrowLeft') this.prevSlide();
  }

  nextSlide() {
    if (this.currentSlideIndex < this.slides.length - 1) this.currentSlideIndex++;
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) this.currentSlideIndex--;
  }

  startEditing() {
    this.originalContent = this.slides[this.currentSlideIndex].content;
    this.isEditing = true;
  }

  cancelEditing() {
    this.slides[this.currentSlideIndex].content = this.originalContent;
    this.isEditing = false;
    this.modifiedSlides.delete(this.currentSlideIndex);
  }

  onContentChange(newContent: string) {
    this.slides[this.currentSlideIndex].content = newContent;
    this.modifiedSlides.add(this.currentSlideIndex);
  }

  hasChanges(): boolean {
    return this.modifiedSlides.has(this.currentSlideIndex);
  }

  saveSlide() {
    if (!this.hasChanges()) return;

    this.businessPlanService.updateSlide(this.plan.id, this.currentSlideIndex, this.slides[this.currentSlideIndex].content)
      .subscribe({
        next: () => {
          this.modifiedSlides.delete(this.currentSlideIndex);
          this.isEditing = false;
        },
        error: () => {
          alert('Erreur lors de la sauvegarde');
          this.cancelEditing();
        }
      });
  }

  close() {
    this.dialogRef.close();
  }
}
