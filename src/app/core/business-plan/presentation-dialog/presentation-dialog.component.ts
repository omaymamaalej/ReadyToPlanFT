import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Slide } from 'src/app/models/Slide';
import { BusinessPlanService } from 'src/app/services/business-plan.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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

  private readonly TABLE_SLIDES = [9, 12, 13, 16, 17];

  constructor(
    private businessPlanService: BusinessPlanService,
    private sanitizer: DomSanitizer
  ) { }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.isEditing) return;
    if (event.key === '>' || event.key === '.' || event.key === 'ArrowRight') {
      this.nextSlide();
      event.preventDefault();
    } else if (event.key === '<' || event.key === ',' || event.key === 'ArrowLeft') {
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

  isTableSlide(index: number): boolean {
    return this.TABLE_SLIDES.includes(index) ||
      (this.slides[index]?.content?.includes('[TABLE]') ?? false);
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
        // cleanedLines.push(lines[0]);
        const firstLine = lines[0].replace(/^\d+\.\s*/, '');
        cleanedLines.push(firstLine);
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
    // Logique de chargement ici
  }

  getCleanTitle(content: string): string {
    if (!content) return '';
    const firstLine = content.split('\n')[0] || '';
    return firstLine
      .replace(/^#\s*\d+\.\s*/, '')
      .replace(/\*\*/g, '')
      .replace(/\[TABLE\]/g, '')
      .trim();
  }

  formatSlideContent(content: string, slideIndex: number): SafeHtml {
    if (!content) return '';
    if (slideIndex === 0) return '';

    let html = content
      .replace(/^#+\s+(.*)/gm, '<h1>$1</h1>')
      .replace(/^##\s+(.*)/gm, '<h2>$1</h2>')
      .replace(/^-\s+(.*)/gm, '<li>$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[TABLE\]/g, '');

    if (this.isTableSlide(slideIndex)) {
      const formattedTables = this.formatTables(html, slideIndex);
      const tableSlideClass = [9, 12, 13, 16, 17].includes(slideIndex) ? 'table-slide' : 'table-slide';
      html = `<div class="${tableSlideClass}">${formattedTables}</div>`;
    }

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private formatTables(html: string, slideIndex: number): string {
    const tableSections = html.split(/(TABLE \d+:)/g);
    let result = '';

    if (tableSections.length > 1) {
      for (let i = 0; i < tableSections.length; i++) {
        if (i % 2 === 1) {
          result += `<h3 class="table-title">${tableSections[i]}</h3>`;
        } else {
          result += this.processTableContent(tableSections[i]);
        }
      }
    } else {
      result = this.processTableContent(html);
    }

    return `<div class="table-container">${result}</div>`;
  }

  private processTableContent(content: string): string {
    content = content.replace(/\[TABLE\]/g, '');

    const tableRegex = /(\|.*\|(\s*\|.*\|)*)/g;

    return content.replace(tableRegex, (match) => {
      const rows = match.trim().split('\n');
      let tableHtml = `<table class="business-table" style="border: 2px solid #ccc; border-collapse: collapse; width: 100%;">`;


      let isNumericColumn: boolean[] = [];

      rows.forEach((row, rowIndex) => {
        const cells = row.split('|').slice(1, -1).map(cell => cell.trim());

        if (rowIndex === 0) {
          tableHtml += '<thead><tr style="background-color: rgb(127, 134, 179); color: black;">';
          cells.forEach((cell, colIndex) => {
            isNumericColumn[colIndex] = /\d/.test(cell.toLowerCase()) ||
              /(revenue|profit|amount|value|€|\$|%)/i.test(cell);
            tableHtml += `<th style="border: 1px solid #ccc; padding: 10px;">${cell}</th>`;
          });
          tableHtml += '</tr></thead><tbody>';
        
        } else if (row.includes('----')) {
          return;
        } else {
          tableHtml += '<tr>';
          cells.forEach((cell, colIndex) => {
            const isHighlighted = cell.includes('**');
            const cleanCell = cell.replace(/\*\*/g, '');
            const classes = [
              isHighlighted ? 'highlight' : '',
              isNumericColumn[colIndex] ? 'numeric' : '',
              colIndex === 0 ? 'main-col' : ''
            ].filter(Boolean).join(' ');

            const tdStyle = 'style="border: 1px solid #ccc; padding: 10px;"';

            tableHtml += classes
              ? `<td class="${classes}" ${tdStyle}>${cleanCell}</td>`
              : `<td ${tdStyle}>${cleanCell}</td>`;
          });

          tableHtml += '</tr>';
        }
      });

      tableHtml += '</tbody></table>';
      return tableHtml;
    });
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
    if (!this.hasChanges(index)) return;

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
    return index === 0
      ? this.businessPlanName
      : firstLine.replace(/^#\s*\d+\.\s*/, '').replace(/\*\*/g, '').trim();
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

