import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessPlanFinalDTO } from 'src/app/models/BusinessPlanFinal';
import { BusinessPlanFinalService } from 'src/app/services/business-plan-final.service';

@Component({
  selector: 'app-business-plan-final',
  templateUrl: './business-plan-final.component.html',
  styleUrls: ['./business-plan-final.component.css']
})
export class BusinessPlanFinalComponent implements OnInit {

formattedContent: string = '';

  companyId: string = localStorage.getItem('selectedCompanyId') || '';
 businessPlan: BusinessPlanFinalDTO | null = null;

  constructor(
    private route: ActivatedRoute,
    private planService: BusinessPlanFinalService
  ) {}

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('companyId');
  if (companyId) {
    this.planService.getAIOnlyBusinessPlan(companyId).subscribe({
      next: (data) => {
        console.log("✅ Données reçues :", data); // 👈 Ici
        this.businessPlan = data;
        if (data.finalContent) {
          this.formattedContent = data.finalContent.replace(/\n/g, '<br/>');
          console.log("🧾 Contenu formaté :", this.formattedContent); // 👈 Ici
        }
      },
      error: (err) => {
        console.error('❌ Erreur chargement plan IA:', err);
      }
    });
  }
  }
 formatContent(content: string): string {
  if (!content) return '';

  // Exemple simple de remplacement pour simuler un rendu HTML
  return content
    .replace(/__\*\*(.*?)\*\*__/g, '<h5>$1</h5>')     // titres
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // gras
    .replace(/__([^_]+)__/g, '<em>$1</em>')           // italique
    .replace(/\n/g, '<br>');                          // sauts de ligne
}
}