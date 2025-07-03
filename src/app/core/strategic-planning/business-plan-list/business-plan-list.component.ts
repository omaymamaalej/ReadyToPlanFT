import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { BusinessPlanFinalDTO } from 'src/app/models/BusinessPlanFinal';
import { BusinessPlanFinalService } from 'src/app/services/business-plan-final.service';
import { BusinessPlanPresentationDialogComponent } from '../business-plan-presentation-dialog/business-plan-presentation-dialog.component';
import { UpdateBusinessPlanFinalComponent } from '../update-business-plan-final/update-business-plan-final.component';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-business-plan-list',
  templateUrl: './business-plan-list.component.html',
  styleUrls: ['./business-plan-list.component.css']
})
export class BusinessPlanListComponent implements OnInit {
  businessPlanDto: BusinessPlanFinalDTO[] = [];
  currentPlan?: BusinessPlanFinalDTO;

  showSearchBar = false;
  searchTerm = '';

  isAdmin: boolean = false;

  @ViewChild('presentationOptionsDialog') presentationOptionsDialog!: TemplateRef<any>;
  @ViewChild('downloadOptionsDialog') downloadOptionsDialog!: TemplateRef<any>;
  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;

  constructor(
    private businessPlanService: BusinessPlanFinalService,
    private dialogService: NbDialogService,
    private tokenStorageService: TokenStorageService
    
  ) { }

 ngOnInit(): void {
  this.businessPlanService.getAll().subscribe({
    next: (data) => {
      console.log("BusinessPlan DTOs:", data);  // 👈 ajoute ceci
      this.businessPlanDto = data;
    },
    error: (err) => console.error('Erreur de chargement', err),
  });
  this.checkRole();
}
  viewPresentation(plan: BusinessPlanFinalDTO): void {
    this.dialogService.open(BusinessPlanPresentationDialogComponent, {
      context: { plan }, // tu passes le plan à afficher
      closeOnBackdropClick: true,
      hasScroll: true,
      dialogClass: 'custom-dialog', // optionnel pour un style personnalisé
    });
  }


  handleDownloadChoice(plan: BusinessPlanFinalDTO, format: 'pdf' | 'ppt'): void {
  if (!plan) return;

  if (format === 'pdf') {
    this.businessPlanService.downloadPresentation(plan.id, 'PDF').subscribe({
      next: (blob) => {
        const filename = `business-plan-${plan.title}-${new Date().toISOString().slice(0, 10)}.pdf`;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement du PDF :', err);
      }
    });
  } else {
    console.warn('Format non pris en charge actuellement :', format);
    // Ajouter la logique pour PPT plus tard si nécessaire
  }
}



openDeleteDialog(plan: BusinessPlanFinalDTO): void {
  if (!plan?.id) {
    console.error('Plan invalide ou ID manquant', plan);
    return;
  }

  this.dialogService.open(this.deleteDialog, {
    context: { plan }, // contexte : un objet avec la clé "plan"
  });
}

confirmDelete(id: string): void {
  console.log('Suppression du plan avec id:', id);
  this.businessPlanService.delete(id).subscribe({
    next: () => {
      this.businessPlanDto = this.businessPlanDto.filter(plan => plan.id !== id);
    },
    error: (err) => {
      console.error('Erreur lors de la suppression :', err);
    }
  });
}
confirmDeleteAndClose(plan: BusinessPlanFinalDTO, ref: any): void {
  console.log('Plan reçu dans confirmDeleteAndClose :', plan);
  if (plan?.id) {
    this.confirmDelete(plan.id);
    ref.close();
  } else {
    console.error('ID manquant', plan);
  }
}



openDownloadOptions(plan: BusinessPlanFinalDTO) {
  this.currentPlan = plan;
  this.dialogService.open(this.downloadOptionsDialog);
}
handlePresentationChoice(option: 'generated' | 'edited' | 'regenerate'): void {
  if (!this.currentPlan) {
    console.warn('Aucun business plan sélectionné.');
    return;
  }

  console.log(`Option choisie : ${option} pour le plan ${this.currentPlan.title}`);
  // Ici, ajoute la logique selon l'option choisie.
  // Par exemple, ouvrir une vue spécifique ou lancer une régénération.

  // Exemple de redirection ou d'action :
  // if (option === 'generated') { ... }
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

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
    if (!this.showSearchBar) {
      this.searchTerm = '';
      this.onSearch(); // Pour réinitialiser la liste si nécessaire
    }
  }

  onSearch() {
    // Implémentez votre logique de recherche ici
    // Par exemple, filtrer businessPlanDto en fonction de searchTerm
  }

    checkRole(): void {
    this.isAdmin = this.tokenStorageService.isAdmin();
  }
}   