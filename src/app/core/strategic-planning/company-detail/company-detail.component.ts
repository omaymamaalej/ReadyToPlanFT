import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { Country } from 'src/app/enumerations/country.enum';
import { Currency } from 'src/app/enumerations/currency.enum';
import { Company } from 'src/app/models/Company';
import { AiGenerationService } from 'src/app/services/ai-generation.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.css']
})
export class CompanyDetailComponent implements OnInit {
  companyForm!: FormGroup;
  countries = Object.entries(Country);
  currencies = Object.entries(Currency);
  @Input() company!: Company;
  isEditing = false;
  selectedCompany: Company | null = null;
  aiResponse: string | null = null;
  @ViewChild('businessPlanDialog') businessPlanDialog!: TemplateRef<any>;
  dialogRef?: NbDialogRef<any>;


  constructor(private fb: FormBuilder, private http: HttpClient,
    private companyService: CompanyService, 
    private aiService: AiGenerationService, 
    private router: Router, 
    private dialogService: NbDialogService,) { }

  ngOnInit(): void {
    const stored = localStorage.getItem('selectedCompany');
    if (stored) {
      this.selectedCompany = JSON.parse(stored);
      this.aiResponse = this.selectedCompany!.aiPresentation || null;
    }

    this.companyForm = this.fb.group({
      enterpriseName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      country: ['', Validators.required],
      description: [''],
      amount: [0, Validators.required],
      currency: ['', Validators.required],
    });

    if (this.selectedCompany) {
      this.companyForm.patchValue(this.selectedCompany);
    }
  }



  loadAIResponse(companyId: string): void {
    this.aiService.getAIResponse('COMPANY', companyId).subscribe({
      next: (response) => {
        this.aiResponse = response.aiResponse;
      },
      error: (err) => {
        console.warn("Aucune réponse IA trouvée pour cette entreprise.");
        this.aiResponse = null;
      }
    });
  }


  edit() {
    this.isEditing = true;
  }

  update() {
    if (this.companyForm.valid && this.selectedCompany) {
      const updatedCompany = { ...this.selectedCompany, ...this.companyForm.value };
      this.companyService.updateCompany(updatedCompany).subscribe({
        next: (updated: Company) => {
          this.selectedCompany = updated;
          localStorage.setItem('selectedCompany', JSON.stringify(updated));
          this.aiResponse = updated.aiPresentation || null; // mise à jour directe
          this.isEditing = false;
        },
        error: (err) => console.error(err),
      });
    }
  }

  goToFinalPlan(): void {
    this.router.navigate(['/business-plan-final']);
  }
  openBusinessPlan(): void {
    const entityId = localStorage.getItem('selectedCompanyId');
    if (!entityId) return;

    this.http.get(`http://localhost:8080/api/businessPlan/final/${entityId}`, { responseType: 'text' })
      .subscribe({
        next: res => {
          this.dialogRef = this.dialogService.open(this.businessPlanDialog, {
            context: {
              content: res
            },
            closeOnBackdropClick: false
          });
        },
        error: err => {
          console.error('Erreur lors de la génération du business plan', err);
          alert('Erreur IA.');
        }
      });
  }
}