import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-presentation-dialog',
  templateUrl: './presentation-dialog.component.html',
  styleUrls: ['./presentation-dialog.component.css']
})
export class PresentationDialogComponent implements OnInit {
  @Input() businessPlanName!: string;
  @Input() presentationContent!: string;

  slides: string[] = [];

  tableOfContents: { title: string, index: number }[] = [];
  sections: string[] = [];
  currentSlideIndex: number = 0;

  ngOnInit() {
    this.parsePresentation(this.presentationContent);
  }

  parsePresentation(content: string) {
    const parts = content.split('===SLIDE===').map(part => part.trim()).filter(p => p.length > 0);

    if (parts.length < 2) {
      console.warn("Format invalide : il manque des '===SLIDE===' pour séparer les sections !");
    }

    console.log("Nombre de slides détectées :", parts.length);
    console.log("Contenu brut des slides :", parts);

    const tocText = parts[0];

    const tocLines = tocText.split('\n')
      .filter(line => /^\d+\.\s+/.test(line))
      .map(line => {
        const title = line.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '').trim(); 
        return title;
      });

    this.tableOfContents = tocLines.map((title, i) => ({ title, index: i + 1 }));

    const tocSlideContent = tocLines.map((title, i) => `${i + 1}. ${title}`).join('\n');

    const slideContent = parts[1];
    const regex = /\*\*\d+\.\s+[^\n]+\*\*/g;

    const matches = slideContent.match(regex);
    const splitSlides = slideContent.split(regex).map(s => s.trim()).filter(Boolean);

    const slides: string[] = [];
    if (matches) {
      matches.forEach((title, i) => {
        const cleanTitle = title.replace(/\*\*/g, '').trim();
        const body = splitSlides[i] ?? '';
        slides.push(`${cleanTitle}\n\n${body}`);
      });
    }

    this.sections = [`Table de matière\n\n${tocSlideContent}`, ...slides];

    console.log("Table des matières détectée :", tocLines);
    console.log("Slides finales utilisées :", this.sections);
    this.currentSlideIndex = 0;
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
  }

  formatText(text: string, isTableOfContents: boolean = false): string {
    if (!text) return '';

    if (isTableOfContents) {
      return text;
    } else {
      return text.replace(/\. /g, '.\n');
    }
  }

  getTitle(index: number): string {
  if (index === 0) return '';
  return this.tableOfContents[index - 1]?.title || '';
}

getSlideContent(index: number, isTableOfContents: boolean = false): string {
  const text = this.sections[index] || '';

  if (isTableOfContents) {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('<br>');
  }

  const lines = text.split('\n');
  const bodyLines = lines.slice(1).join('\n');

  const formattedBody = bodyLines
    .replace(/^\*\s*$/gm, '')
    .replace(/\*\s*$/gm, '')
    .replace(/(^|\s)\*(?=\s|$)/g, '')
    .replace(/\*\*(.+?)\*\*/g, (_, subtitle) => {
      const clean = subtitle.trim().replace(/:$/, '');
      return `<br><strong>${clean} :</strong>`;
    })
    .replace(/\. /g, '.<br>');

  return formattedBody.trim();
}





}
