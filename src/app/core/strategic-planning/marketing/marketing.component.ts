import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Currency } from 'src/app/enumerations/currency.enum';
import { Marketing } from 'src/app/models/Marketing';
import { MarketingService } from 'src/app/services/marketing.service';
import { MarketingDetailComponent } from '../marketing-detail/marketing-detail.component';
import { AiGenerationServiceService } from 'src/app/services/ai-generation-service.service';
import { AiResponseDialogComponent } from '../ai-response-dialog/ai-response-dialog.component';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.css']
})
export class MarketingComponent  implements OnInit  {
aiResponsesMap: { [memberId: string]: string } = {};
  marketingList: Marketing[] = [];

  companyId: string | undefined = localStorage.getItem('selectedCompanyId') ?? undefined;

  constructor(
    private marketingService: MarketingService,
    private dialogService: NbDialogService,
    private aiService: AiGenerationServiceService
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
}