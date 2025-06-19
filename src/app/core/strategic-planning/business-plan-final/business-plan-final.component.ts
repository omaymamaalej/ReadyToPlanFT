import { Component, OnInit } from '@angular/core';
import { AiGenerationServiceService } from 'src/app/services/ai-generation-service.service';

@Component({
  selector: 'app-business-plan-final',
  templateUrl: './business-plan-final.component.html',
  styleUrls: ['./business-plan-final.component.css']
})
export class BusinessPlanFinalComponent implements OnInit {
  finalPlan: string = '';
  companyId = localStorage.getItem('selectedCompanyId') || '';

  constructor(private aiService: AiGenerationServiceService) {}

  ngOnInit(): void {
    if (this.companyId) {
      this.aiService.getBusinessPlanFinal(this.companyId).subscribe({
        next: res => this.finalPlan = res,
        error: err => {
          this.finalPlan = 'Erreur lors de la génération du business plan.';
          console.error(err);
        }
      });
    } else {
      this.finalPlan = 'Aucune entreprise sélectionnée.';
    }
  }
}
