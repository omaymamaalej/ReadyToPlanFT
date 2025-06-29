import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { BusinessPlanFinalDTO } from 'src/app/models/BusinessPlanFinal';
import { BusinessPlanFinalService } from 'src/app/services/business-plan-final.service';
import { BusinessPlanPresentationDialogComponent } from '../business-plan-presentation-dialog/business-plan-presentation-dialog.component';
import { UpdateBusinessPlanFinalComponent } from '../update-business-plan-final/update-business-plan-final.component';

@Component({
  selector: 'app-business-plan-list',
  templateUrl: './business-plan-list.component.html',
  styleUrls: ['./business-plan-list.component.css']
})
export class BusinessPlanListComponent implements OnInit {
  businessPlanDto: BusinessPlanFinalDTO[] = [];
  currentPlan?: BusinessPlanFinalDTO;

  @ViewChild('presentationOptionsDialog') presentationOptionsDialog!: TemplateRef<any>;
  @ViewChild('downloadOptionsDialog') downloadOptionsDialog!: TemplateRef<any>;
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;

  constructor(
    private businessPlanService: BusinessPlanFinalService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.businessPlanService.getAll().subscribe({
      next: (data) => (this.businessPlanDto = data),
      error: (err) => console.error('Erreur de chargement', err),
    });
  }

 viewPresentation(plan: BusinessPlanFinalDTO): void {
  this.dialogService.open(BusinessPlanPresentationDialogComponent, {
    context: { plan }, // tu passes le plan à afficher
    closeOnBackdropClick: true,
    hasScroll: true,
    dialogClass: 'custom-dialog', // optionnel pour un style personnalisé
  });
}

  openDownloadOptions(plan: BusinessPlanFinalDTO) {
    this.currentPlan = plan;
    this.dialogService.open(this.downloadOptionsDialog);
  }

 openDeleteDialog(plan: BusinessPlanFinalDTO): void {
  if (!plan?.id) {
    console.error('Plan invalide ou ID manquant', plan);
    return;
  }
  this.dialogService.open(this.deleteDialog, {
    context: { plan }
  });
}


confirmDelete(id: string): void {
  this.businessPlanService.delete(id).subscribe({
    next: () => {
      this.businessPlanDto = this.businessPlanDto.filter(plan => plan.id !== id);
    },
    error: (err) => {
      console.error('Erreur lors de la suppression :', err);
    }
  });
}


  handlePresentationChoice(option: 'generated' | 'edited' | 'regenerate') {
    console.log('Présentation choisie :', option, this.currentPlan?.id);
    // Logique personnalisée selon le bouton choisi
  }

  handleDownloadChoice(format: 'pdf' | 'ppt') {
    console.log('Téléchargement format :', format, this.currentPlan?.id);
    // Appelle le backend pour générer le fichier
  }
  
openEditDialog(plan: BusinessPlanFinalDTO): void {
  this.dialogService.open(UpdateBusinessPlanFinalComponent, {
    context: {
      businessPlanFinal: plan
    },
    closeOnBackdropClick: false,
    hasScroll: true,
  }).onClose.subscribe((updated: boolean) => {
    if (updated) {
      this.ngOnInit();
    }
  });
}
}   