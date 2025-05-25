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
      const title = line.replace(/^\d+\.\s+/, '').trim();
      return title;
    });

  this.tableOfContents = tocLines.map((title, i) => ({ title, index: i + 1 }));

  const tocSlideContent = tocLines.map((title, i) => `${i + 1}. ${title}`).join('\n');

  // 🔽 Découpage réel des sections à partir des titres "**1. ", "**2. ", etc.
  const slideContent = parts[1];
  const regex = /\*\*\d+\.\s+[^\n]+\*\*/g;

  const matches = slideContent.match(regex);
  const splitSlides = slideContent.split(regex).map(s => s.trim()).filter(Boolean);

  const slides: string[] = [];
  if (matches) {
    matches.forEach((title, i) => {
      const body = splitSlides[i] ?? '';
      slides.push(`${title}\n\n${body}`);
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
}
