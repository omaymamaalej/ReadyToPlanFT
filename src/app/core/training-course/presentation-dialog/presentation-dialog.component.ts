import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import PptxGenJS from 'pptxgenjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-presentation-dialog',
  templateUrl: './presentation-dialog.component.html',
  styleUrls: ['./presentation-dialog.component.css']
})
export class PresentationDialogComponent implements OnInit {

  @Input() presentationText: string = '';
  @Input() courseData: any = {};

  currentSlideIndex: number = 0;
  presentationSlidesRaw: string[] = [];
  presentationSlidesHtml: SafeHtml[] = [];
  private styleElement: HTMLStyleElement | null = null;

  constructor(
    protected ref: NbDialogRef<PresentationDialogComponent>,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    if (this.presentationText) {
      this.processPresentationText();
      this.injectGlobalStyles();
    }
  }

  ngOnDestroy() {
    this.removeGlobalStyles();
  }

  private injectGlobalStyles() {
    this.removeGlobalStyles();
    
    this.styleElement = document.createElement('style');
    this.styleElement.innerHTML = `
      .slide-content .table-container {
        overflow-x: auto;
        margin: 25px 0;
        border-radius: 10px;
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.08) !important;
      }

      .slide-content .styled-table {
        border-collapse: collapse !important;
        width: 100% !important;
        font-size: 0.95em !important;
        min-width: 600px;
        margin: 1.5rem 0 !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        border-radius: 8px !important;
        overflow: hidden !important;
      }

      .slide-content .styled-table thead tr {
        background: linear-gradient(135deg, #4b6cb7 0%, #182848 100%) !important;
        color: #ffffff !important;
        text-align: left !important;
      }

      .slide-content .styled-table th,
      .slide-content .styled-table td {
        padding: 12px 15px !important;
        border: 1px solid #ddd !important;
        text-align: left !important;
      }

      .slide-content .styled-table th {
        background: #3498DB !important;
        color: white !important;
        font-weight: 600 !important;
        font-size: 1.05em !important;
      }

      .slide-content .styled-table td {
        background: #ECF0F1 !important;
        color: #333 !important;
      }

      .slide-content .styled-table tbody tr {
        border-bottom: 1px solid #ddd !important;
      }

      .slide-content .styled-table tbody tr:last-child td {
        border-bottom: none !important;
      }

      .slide-content .styled-table tbody tr.highlight td {
        background: #e3f2fd !important;
        font-weight: 600 !important;
        color: #1976d2 !important;
      }

      .slide-content .styled-table tbody tr:hover td {
        background: #f1f8ff !important;
      }

      /* Styles pour les tableaux sans classes (fallback) */
      .slide-content table:not(.styled-table) {
        border-collapse: collapse;
        width: 100%;
        font-size: 1rem;
        margin: 1.5rem 0;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
      }

      .slide-content table:not(.styled-table) th {
        background: #3498DB;
        color: white;
        text-align: left;
        padding: 12px 15px;
        font-weight: 600;
      }

      .slide-content table:not(.styled-table) td {
        background: #ECF0F1;
        padding: 10px 15px;
        border-bottom: 1px solid #ddd;
      }

      .slide-content table:not(.styled-table) tr:last-child td {
        border-bottom: none;
      }
    `;
    
    document.head.appendChild(this.styleElement);
  }

  private removeGlobalStyles() {
    if (this.styleElement && document.head.contains(this.styleElement)) {
      document.head.removeChild(this.styleElement);
    }
    this.styleElement = null;
  }

  

  private processPresentationText() {
    const parser = new DOMParser();
    const doc = parser.parseFromString(this.presentationText, "text/html");

    // Récupérer chaque <section class="slide">
    const sections = Array.from(doc.querySelectorAll("section.slide"));
    this.presentationSlidesRaw = sections.map(sec => {
      return this.decodeHtmlEntities(sec.outerHTML || sec.textContent || '');
    });

    // Appliquer les styles aux tableaux avant la sanitization
    this.presentationSlidesHtml = this.presentationSlidesRaw.map(raw => {
      const processedHtml = this.processTableStyles(raw);
      return this.sanitizer.bypassSecurityTrustHtml(processedHtml);
    });
  }

  private processTableStyles(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Appliquer les classes aux tableaux qui n'en ont pas
    const tables = doc.querySelectorAll('table:not(.styled-table)');
    tables.forEach(table => {
      table.classList.add('styled-table');
      
      // S'assurer qu'il y a un container autour du tableau
      if (!table.parentElement?.classList.contains('table-container')) {
        const container = doc.createElement('div');
        container.classList.add('table-container');
        table.parentNode?.insertBefore(container, table);
        container.appendChild(table);
      }
    });

    return doc.body.innerHTML;
  }


  // Décode les entités HTML si nécessaire
  private decodeHtmlEntities(input: string): string {
    const txt = document.createElement('textarea');
    txt.innerHTML = input;
    return txt.value;
  }

  getSlideTitleFromRaw(rawHtml: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, 'text/html');

    const h1 = doc.querySelector('h1');
    if (h1) return (h1.textContent || 'Titre').trim().substring(0, 40);

    const h2 = doc.querySelector('h2');
    if (h2) return (h2.textContent || 'Sous-titre').trim().substring(0, 40);

    const text = doc.body.textContent || '';
    return text.trim().substring(0, 40) + (text.length > 40 ? '...' : '');
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
  }

  nextSlide() {
    if (this.currentSlideIndex < this.presentationSlidesRaw.length - 1) {
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

  async downloadPresentation() {
    const pptx = new PptxGenJS();

    // Master slide
    pptx.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { color: 'FFFFFF' },
      objects: [
        { 'line': { x: 0.0, y: 0.5, w: '100%', line: { color: '4B6CB7', width: 1 } } },
        { 'text': { text: 'Formation', options: { x: 0.5, y: 0.1, w: 9, h: 0.5, fontSize: 14, color: '6C757D' } } }
      ]
    });

    for (let index = 0; index < this.presentationSlidesRaw.length; index++) {
      const slideHtml = this.presentationSlidesRaw[index];
      const parser = new DOMParser();
      const doc = parser.parseFromString(slideHtml, 'text/html');

      const pptxSlide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });

      // Première slide -> page de garde spéciale
      if (index === 0) {
        pptxSlide.background = { color: '4B6CB7' };
        pptxSlide.addText(this.courseData.title || 'Titre du cours', {
          x: 0.5, y: 1.5, w: 9, h: 1.5,
          fontSize: 32,
          bold: true,
          align: "center",
          color: "FFFFFF"
        });

        const infoY = 3.5;
        pptxSlide.addText(`Public: ${this.courseData.targetAudience || 'N/A'}`, {
          x: 0.5, y: infoY, w: 9, h: 0.4,
          fontSize: 18,
          align: "center",
          color: "FFFFFF"
        });

        pptxSlide.addText(`Niveau: ${this.courseData.level || 'N/A'}`, {
          x: 0.5, y: infoY + 0.5, w: 9, h: 0.4,
          fontSize: 18,
          align: "center",
          color: "FFFFFF"
        });

        pptxSlide.addText(`Classe: ${this.courseData.studyClass || 'N/A'}`, {
          x: 0.5, y: infoY + 1.0, w: 9, h: 0.4,
          fontSize: 18,
          align: "center",
          color: "FFFFFF"
        });

        continue;
      }

      // Titre principal
      const titleElement = doc.querySelector('h1') || doc.querySelector('h2');
      if (titleElement) {
        pptxSlide.addText((titleElement.textContent || '').trim(), {
          x: 0.5, y: 0.7, w: 9, h: 0.8,
          fontSize: 24,
          bold: true,
          align: "center",
          color: "2C3E50"
        });
      }

      let yPos = 1.8;

      // Paragraphes
      doc.querySelectorAll('p').forEach(p => {
        const text = (p.textContent || '').trim();
        if (text.length > 0) {
          pptxSlide.addText(text, {
            x: 0.5, y: yPos, w: 9, h: 0.4,
            fontSize: 14,
            color: "000000",
            wrap: true
          });
          yPos += 0.5;
        }
      });

      // Listes
      doc.querySelectorAll('ul, ol').forEach(list => {
        const items: string[] = [];
        list.querySelectorAll('li').forEach(li => {
          items.push((li.textContent || '').trim());
        });

        if (items.length > 0) {
          pptxSlide.addText(items.map(item => `• ${item}`).join('\n'), {
            x: 0.8, y: yPos, w: 8.5, h: 0.3 * items.length,
            fontSize: 14,
            color: "2C3E50",
            bullet: true
          });
          yPos += 0.3 * items.length + 0.2;
        }
      });

      // Tableaux
      // Tableaux - rechercher les tableaux avec la classe styled-table
      const tables = doc.querySelectorAll('.styled-table, table');
      tables.forEach(table => {
        const rows: any[] = [];
        
        // First find header if exists
        const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
        if (headerRow) {
          const headerCells = Array.from(headerRow.querySelectorAll('th, td')).map(cell => {
            const isTh = cell.tagName.toLowerCase() === 'th';
            return {
              text: (cell.textContent || '').trim(),
              options: {
                fill: '4B6CB7', // Header background
                color: 'FFFFFF', // Header text color
                fontSize: 12,
                bold: true,
                align: 'center'
              }
            };
          });
          rows.push(headerCells);
        }

        // remaining rows - gérer les lignes highlight
        const tbody = table.querySelector('tbody');
        const rowsToProcess = tbody ? tbody.querySelectorAll('tr') : table.querySelectorAll('tr:not(:first-child)');
        
        rowsToProcess.forEach((tr, idx) => {
          const isHighlight = tr.classList.contains('highlight');
          const cells = Array.from(tr.querySelectorAll('td, th')).map(cell => {
            const isTh = cell.tagName.toLowerCase() === 'th';
            return {
              text: (cell.textContent || '').trim(),
              options: {
                fill: isHighlight ? 'E3F2FD' : (idx % 2 === 0 ? 'FFFFFF' : 'F8F9FA'),
                color: isHighlight ? '1976D2' : '000000',
                fontSize: 12,
                bold: isHighlight || isTh,
                align: 'left'
              }
            };
          });
          rows.push(cells);
        });

        if (rows.length > 0) {
          pptxSlide.addTable(rows, {
            x: 0.5,
            y: yPos,
            w: 8.5,
            // dynamic col widths
            colW: new Array((rows[0] || []).length).fill(8.5 / ((rows[0] || []).length || 1)),
            border: { type: 'solid', color: 'CCCCCC' }
          });
          yPos += 0.5 * rows.length + 0.5;
        }
      });

      // Timeline (chronologie)
      const timelineItems = doc.querySelectorAll('.timeline-item');
      if (timelineItems.length > 0) {
        pptxSlide.addText('Chronologie:', {
          x: 0.5, y: yPos, w: 9, h: 0.5,
          fontSize: 16,
          bold: true,
          color: "2C3E50"
        });
        yPos += 0.6;
        
        timelineItems.forEach((item, idx) => {
          const year = item.querySelector('.timeline-year')?.textContent || `Étape ${idx + 1}`;
          const content = item.querySelector('.timeline-content')?.textContent || '';
          
          pptxSlide.addText(`${year}: ${content}`, {
            x: 0.8, y: yPos, w: 8.5, h: 0.4,
            fontSize: 12,
            color: "2C3E50",
            bullet: true
          });
          yPos += 0.5;
        });
        yPos += 0.3;
      }

      // Images (data urls) - convertir en images PPTX
      const images = doc.querySelectorAll('img');
      for (const img of Array.from(images)) {
        const src = img.getAttribute('src') || '';
        if (src.startsWith('data:image')) {
          // add image to slide
          try {
            pptxSlide.addImage({
              data: src, // PptxGenJS accepte data urls
              x: 1, y: yPos, w: 8, h: 3
            });
            yPos += 3.2;
          } catch (err) {
            // si erreur, ajouter un texte fallback
            pptxSlide.addText('[Image non insérée]', { x: 1, y: yPos, w: 8, h: 0.3, color: '888888' });
            yPos += 0.5;
          }
        } else if (src.startsWith('http')) {
          // On pourrait fetch l'image et la convertir en base64 si nécessaire. Ici on met un placeholder.
          pptxSlide.addText('[Image externe non intégrée]', { x: 1, y: yPos, w: 8, h: 0.3, color: '888888' });
          yPos += 0.5;
        }
      }

      // Graphique placeholder fallback
      if (doc.querySelector('.chart') && images.length === 0) {
        pptxSlide.addText('[Graphique]', {
          x: 1, y: yPos, w: 7, h: 2,
          fontSize: 12,
          color: "888888",
          align: "center",
          fill: { color: 'F0F0F0' }
        });
        yPos += 2.2;
      }
    }

    await pptx.writeFile({ fileName: "Presentation_Cours.pptx" });
  }
}