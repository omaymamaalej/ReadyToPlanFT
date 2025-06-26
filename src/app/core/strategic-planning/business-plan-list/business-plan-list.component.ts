import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { BusinessPlanFinalDTO } from 'src/app/models/BusinessPlanFinal';
import { BusinessPlanFinalService } from 'src/app/services/business-plan-final.service';
import { BusinessPlanPresentationDialogComponent } from '../business-plan-presentation-dialog/business-plan-presentation-dialog.component';

@Component({
  selector: 'app-business-plan-list',
  templateUrl: './business-plan-list.component.html',
  styleUrls: ['./business-plan-list.component.css']
})
export class BusinessPlanListComponent implements OnInit {
  businessPlanDto: BusinessPlanFinalDTO[] = [];

  page: number = 1;

  constructor(private businessPlanService: BusinessPlanFinalService, 
    private dialogService: NbDialogService) { }


  ngOnInit(): void {
    this.businessPlanService.getAll().subscribe({
      next: (data) => (this.businessPlanDto = data),
      error: (err) => console.error('Erreur de chargement des plans', err),
    });
  }
  generatePresentation(plan: BusinessPlanFinalDTO): void {
    this.dialogService.open(BusinessPlanPresentationDialogComponent, {
      context: { plan },
      closeOnBackdropClick: true,
    });
  }


  deleteBusinessPlan(plan: BusinessPlanFinalDTO): void {
    console.log('Suppression plan', plan);
    // Ajoute ici la logique de suppression si nécessaire
  }
}