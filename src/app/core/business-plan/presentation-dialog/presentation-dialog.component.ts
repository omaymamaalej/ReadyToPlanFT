import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Slide } from 'src/app/models/Slide';
import { BusinessPlanService } from 'src/app/services/business-plan.service';

@Component({
  selector: 'app-presentation-dialog',
  templateUrl: './presentation-dialog.component.html',
  styleUrls: ['./presentation-dialog.component.css']
})
export class PresentationDialogComponent implements OnInit {
  @Input() businessPlanId!: string;
  @Input() businessPlanName!: string;
  @Input() presentationContent?: string;

  slides: Slide[] = [];
  currentSlideIndex: number = 0;
  isEditing: boolean = false;
  isLoading: boolean = true;
  errorMessage: string | null = null;

  private originalContent = '';
  modifiedSlides: Set<number> = new Set();


  constructor(private businessPlanService: BusinessPlanService) { }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isEditing) return;
    if (event.key === '>' || event.key === '.' || event.key === 'ArrowRight') {
      this.nextSlide();
      event.preventDefault();
    }
    else if (event.key === '<' || event.key === ',' || event.key === 'ArrowLeft') {
      this.prevSlide();
      event.preventDefault();
    }
  }

  ngOnInit() {
    if (this.presentationContent) {
      this.parsePresentationContent(this.presentationContent);
      this.isLoading = false;
    } else {
      this.loadPresentation();
    }
  }

  private parsePresentationContent(content: string): void {
    const slideContents = content.split(/===SLIDE===\s*\n+/)
      .map(slide => slide.trim())
      .filter(slide => slide.length > 0);

    this.slides = slideContents.map((content, index) => {
      if (index === 0) return { content };

      const lines = content.split('\n');
      let cleanedLines: string[] = [];

      if (lines.length > 0) {
        cleanedLines.push(lines[0]);
      }

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('## ') &&
          line.substring(3).trim() === lines[0].replace(/^#\s*\d+\.\s*/, '').trim()) {
          continue;
        }
        cleanedLines.push(line);
      }

      return { content: cleanedLines.join('\n') };
    });
  }

  loadPresentation() {
    this.isLoading = true;
    this.errorMessage = null;

  }

  getCleanTitle(content: string): string {
    if (!content) return '';

    const firstLine = content.split('\n')[0] || '';
    return firstLine
      .replace(/^\d+\.\s*/, '') 
      .replace(/\*\*/g, '')     
      .trim();
  }

  formatSlideContent(content: string, slideIndex: number): string {
    if (!content) return '';

    if (slideIndex === 0) {
      return '';
    }

    const lines = content.split('\n');
    let html = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (i === 0) continue;

      if (line.startsWith('## ')) {
        html += `<h2>${line.substring(3)}</h2>`;
      } else if (line.startsWith('- ')) {
        if (i === 1 || !lines[i - 1].startsWith('- ')) html += '<ul>';
        html += `<li>${line.substring(2)}</li>`;
        if (i === lines.length - 1 || !lines[i + 1].startsWith('- ')) html += '</ul>';
      } else if (line.match(/\*\*.+\*\*/)) {
        html += line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      } else if (line) {
        html += `<p>${line}</p>`;
      }
    }

    return html;
  }

  goToSlide(index: number) {
    if (index >= 0 && index < this.slides.length) {
      this.currentSlideIndex = index;
      this.isEditing = false;
      this.originalContent = this.slides[index].content;
    }
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

  hasChanges(index: number): boolean {
    return this.modifiedSlides.has(index);
  }

  onContentChange(index: number, newContent: string) {
    this.slides[index].content = newContent;
    this.modifiedSlides.add(index);
  }

  saveSlide(index: number) {
    if (!this.hasChanges(index)) {
      return;
    }

    this.businessPlanService.updateSlide(
      this.businessPlanId,
      index,
      this.slides[index].content
    ).subscribe({
      next: () => {
        this.modifiedSlides.delete(index);
        this.isEditing = false;

        console.log(`Slide ${index} updated successfully`);
      },
      error: (err) => {
        console.error('Error updating slide:', err);
        this.slides[index].content = this.originalContent;
        this.modifiedSlides.delete(index);
        this.isEditing = false;
      }
    });
  }

  saveAllChanges() {
    this.modifiedSlides.forEach(index => {
      this.saveSlide(index);
    });
  }

  getSlideTitle(index: number): string {
    if (!this.slides[index]?.content) return `Slide ${index + 1}`;

    const content = this.slides[index].content;
    const firstLine = content.split('\n')[0] || '';
    
    if (index === 0) {
      return this.businessPlanName;
    }
    
    return firstLine
      .replace(/^#\s*\d+\.\s*/, '')  
      .replace(/\*\*/g, '')         
      .trim();
  }

  isTableOfContents(index: number): boolean {
    return index === 0;
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.slides.length - 1) {
      this.currentSlideIndex++;
    }
  }
}

