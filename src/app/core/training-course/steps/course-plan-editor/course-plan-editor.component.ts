import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-course-plan-editor',
  templateUrl: './course-plan-editor.component.html',
  styleUrls: ['./course-plan-editor.component.css']
})
export class CoursePlanEditorComponent {

  @Input() coursePlan: string = '';
  @Output() planUpdated = new EventEmitter<string>();
  
  editForm!: FormGroup;
  chapters: any[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.parsePlan();
    this.initForm();
  }

  private parsePlan() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.coursePlan, 'text/html');
    
    const chapters = doc.querySelectorAll('.chapter');
    this.chapters = Array.from(chapters).map((chapter, index) => {
      // Gérer les titres en français et anglais
      const titleElement = chapter.querySelector('.chapter-title');
      let title = '';
      let duration = '';
      
      if (titleElement) {
        const titleText = titleElement.textContent || '';
        // Supprimer "Chapitre X" ou "Chapter X"
        title = titleText.replace(/Chapitre \d+|Chapter \d+/g, '').trim();
      }
      
      // Gérer la durée en français et anglais
      const durationElement = chapter.querySelector('.chapter-duration');
      if (durationElement) {
        const durationText = durationElement.textContent || '';
        duration = durationText
          .replace('⏱️ Durée estimée:', '')
          .replace('⏱️ Estimated duration:', '')
          .trim();
      }
      
      return {
        title: title,
        duration: duration,
        subtopics: Array.from(chapter.querySelectorAll('.subtopic')).map(subtopic => 
          subtopic.textContent?.replace('•', '').trim() || ''
        )
      };
    });
  }

  private initForm() {
    this.editForm = this.fb.group({
      chapters: this.fb.array(this.chapters.map(chapter => this.createChapterGroup(chapter)))
    });
  }

  private createChapterGroup(chapter: any): FormGroup {
    return this.fb.group({
      title: [chapter.title],
      duration: [chapter.duration],
      subtopics: this.fb.array(chapter.subtopics.map((subtopic: string) => new FormControl(subtopic)))
    });
  }

  get chaptersArray(): FormArray {
    return this.editForm.get('chapters') as FormArray;
  }

  getSubtopics(index: number): FormArray {
    return this.chaptersArray.at(index).get('subtopics') as FormArray;
  }

  addSubtopic(chapterIndex: number) {
    const subtopics = this.getSubtopics(chapterIndex);
    subtopics.push(new FormControl(''));
  }

  removeSubtopic(chapterIndex: number, subtopicIndex: number) {
    const subtopics = this.getSubtopics(chapterIndex);
    subtopics.removeAt(subtopicIndex);
  }

  saveEdits() {
    const updatedPlan = this.generateUpdatedPlan();
    this.planUpdated.emit(updatedPlan);
  }

  private generateUpdatedPlan(): string {
    let planHtml = `
      <div class="modern-course-plan">
        <div class="plan-header">
          <h1>📋 PLAN DU COURS</h1>
          <p class="total-duration">⏱️ Durée totale calculée automatiquement</p>
        </div>
        <div class="chapters-container">
    `;

    this.chaptersArray.controls.forEach((chapterGroup, index) => {
      const chapter = chapterGroup.value;
      planHtml += `
        <div class="chapter">
          <h2 class="chapter-title">
            <span class="chapter-number">Chapitre ${index + 1}</span>
            ${chapter.title}
          </h2>
          <div class="chapter-duration">⏱️ Durée estimée: ${chapter.duration}</div>
          <div class="subtopics">
      `;

      chapter.subtopics.forEach((subtopic: string) => {
        if (subtopic.trim()) {
          planHtml += `<div class="subtopic">• ${subtopic}</div>`;
        }
      });

      planHtml += `
          </div>
        </div>
      `;
    });

    planHtml += `
        </div>
      </div>
    `;

    return planHtml;
  }

  cancelEdits() {
    this.planUpdated.emit(this.coursePlan);
  }
}
