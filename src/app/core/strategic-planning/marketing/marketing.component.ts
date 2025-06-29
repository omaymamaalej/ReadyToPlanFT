import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { AiResponseDialogComponent } from '../ai-response-dialog/ai-response-dialog.component';
import { MarketingDetailComponent } from '../marketing-detail/marketing-detail.component';
import { Marketing } from 'src/app/models/Marketing';
import { MarketingService } from 'src/app/services/marketing.service';
import { AiGenerationService } from 'src/app/services/ai-generation.service';
import { BusinessPlanFinalService } from 'src/app/services/business-plan-final.service';
import { catchError, of } from 'rxjs';
import { BusinessPlanPresentationDialogComponent } from '../business-plan-presentation-dialog/business-plan-presentation-dialog.component';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.css']
})
export class MarketingComponent implements OnInit {
  
  aiResponsesMap: { [memberId: string]: string } = {};
  marketingList: Marketing[] = [];
businessPlanFinal: any;
  companyId: string | undefined = localStorage.getItem('selectedCompanyId') ?? undefined;
  loading = false;
  errorMessage = '';
  constructor(
    private marketingService: MarketingService,
    private dialogService: NbDialogService,
    private aiService: AiGenerationService,
     private businessPlanFinalService: BusinessPlanFinalService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.loadMarketing();
  }

loadMarketing(): void {
  const companyId = localStorage.getItem('selectedCompanyId');
  if (!companyId) {
    alert("Aucune entreprise sélectionnée.");
    return;
  }

  this.marketingService.getByCompanyId(companyId).pipe(
    catchError(err => {
      console.error("Erreur serveur ou parsing:", err);
      return of([]);
    })
  ).subscribe({
    next: data => {
      console.log("Réponse brute marketing:", data);
      this.marketingList = data;

      // 🔁 Pour chaque marketing, récupérer la réponse IA
      this.marketingList.forEach(item => {
        if (item.id) {
          this.aiService.getAIResponse('MARKETING', item.id).subscribe({
            next: res => {
              console.log("Réponse IA pour", item.id, ":", res);
              this.aiResponsesMap[item.id!] = res.aiResponse;
            },
            error: err => {
              console.error("Erreur IA pour l'id", item.id, ":", err);
              this.aiResponsesMap[item.id!] = "Erreur lors du chargement.";
            }
          });
        }
      });
    },
    error: err => {
      console.error("Erreur chargement marketing:", err);
    }
  });
}


  showAIResponse(id: string): void {
    const content = this.aiResponsesMap[id] || 'Aucune réponse IA.';
    this.dialogService.open(AiResponseDialogComponent, {
      context: { aiResponse: content },
    });
  }

  openAddDialog(): void {
    this.dialogService.open(MarketingDetailComponent, {
      context: {
        companyId: this.companyId
      }
    }).onClose.subscribe(res => {
      if (res) this.loadMarketing();
    });
  }

  editMarketing(item: Marketing): void {
    this.dialogService.open(MarketingDetailComponent, {
      context: {
        marketingToEdit: item,
        companyId: this.companyId
      }
    }).onClose.subscribe(res => {
      if (res) this.loadMarketing();
    });
  }

  deleteMarketing(id: string): void {
    if (confirm('Confirmer la suppression ?')) {
      this.marketingService.delete(id).subscribe(() => this.loadMarketing());
    }
  }

generateBusinessPlan(): void {
  if (!this.companyId) {
    console.error("Company ID manquant");
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  this.businessPlanFinalService.generateBusinessPlan(this.companyId).subscribe({
    next: (res) => {
      this.loading = false;
      this.businessPlanFinal = res;

      // ✅ Ouvrir la boîte de dialogue avec le plan généré
      this.dialogService.open(BusinessPlanPresentationDialogComponent, {
        context: {
          plan: {
            title: res.title ?? 'Business Plan',
            creationDate: res.creationDate ?? new Date().toISOString(),
            finalContent: res.finalContent ?? 'Aucun contenu disponible.',
            id: ''
          }
        }
      });
    },
    error: (err) => {
      this.loading = false;
      this.errorMessage = 'Erreur lors de la génération du business plan.';
      console.error(err);
    }
  });
}
 


}