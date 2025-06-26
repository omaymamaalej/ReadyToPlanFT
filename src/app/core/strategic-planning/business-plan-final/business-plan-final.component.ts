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


  companyId: string = localStorage.getItem('selectedCompanyId') || '';
  businessPlan: BusinessPlanFinalDTO | null = null;

  constructor(
    private route: ActivatedRoute,
    private planService: BusinessPlanFinalService
  ) { }

  ngOnInit(): void {
    const companyId = this.route.snapshot.paramMap.get('companyId');
    if (companyId) {
      this.planService.getAIOnlyBusinessPlan(companyId).subscribe({
        next: (data) => {
          this.businessPlan = data;
        },
        error: (err) => {
          console.error('Erreur chargement plan IA:', err);
        }
      });
    }
  }
}