import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import PptxGenJS from 'pptxgenjs';

@Component({
  selector: 'app-presentation-dialog',
  templateUrl: './presentation-dialog.component.html',
  styleUrls: ['./presentation-dialog.component.css']
})
export class PresentationDialogComponent implements OnInit {

  @Input() presentationText: string = '';

  currentSlideIndex: number = 0;
  presentationSlides: string[] = [];

  constructor(protected ref: NbDialogRef<PresentationDialogComponent>) {}

  ngOnInit() {
    if (this.presentationText) {
      this.presentationSlides = this.presentationText.split('\n\n').filter(slide => slide.trim().length > 0);
    }
  }

  getSlideTitle(slide: string): string {
    const lines = slide.split('\n');
    return lines[0] || 'Slide Title';
  }

  getSlideSubtitle(slide: string): string {
    const lines = slide.split('\n');
    return lines.length > 1 ? lines[1] : 'Slide Subtitle';
  }

  getSlideContent(slide: string): string {
    const lines = slide.split('\n');
    if (lines.length <= 2) return '';
    
    return lines.slice(2).join('<br>');
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
  }

  nextSlide() {
    if (this.currentSlideIndex < this.presentationSlides.length - 1) {
      this.currentSlideIndex++;
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
    }
  }

  close() {
    this.ref.close();
  }

  downloadPresentation() {
    const pptx = new PptxGenJS();
    
    this.presentationSlides.forEach((slide, index) => {
      const pptxSlide = pptx.addSlide();
      
      pptxSlide.addText(this.getSlideTitle(slide), {
        x: 0.5, y: 0.5, w: 9, h: 0.8,
        fontSize: 24,
        bold: true,
        align: "center",
        color: "4B6CB7"
      });
      
      if (this.getSlideSubtitle(slide) !== 'Slide Subtitle') {
        pptxSlide.addText(this.getSlideSubtitle(slide), {
          x: 0.5, y: 1.5, w: 9, h: 0.5,
          fontSize: 18,
          italic: true,
          align: "center",
          color: "6C757D"
        });
      }
      
      const content = this.getSlideContent(slide).replace(/<br>/g, '\n');
      if (content) {
        pptxSlide.addText(content, {
          x: 0.5, y: 2.2, w: 9, h: 4,
          fontSize: 14,
          color: "000000",
          wrap: true
        });
      }
    });

    pptx.writeFile({ fileName: "TrainingCourse_Presentation.pptx" });
  }
}