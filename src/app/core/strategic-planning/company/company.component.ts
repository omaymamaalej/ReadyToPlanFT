import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { Country } from 'src/app/enumerations/country.enum';
import { Currency } from 'src/app/enumerations/currency.enum';
import { Company } from 'src/app/models/Company';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companyForm!: FormGroup;
  countries = Object.entries(Country);
  currencies = Object.entries(Currency);
  showDetail = false;
  selectedCompany: Company | null = null;
  isSubmitting = false; // Ajout pour désactiver le bouton pendant la soumission

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private toastrService: NbToastrService
  ) {
    this.initializeForm();
    this.loadSavedFormData();
  }

  ngOnInit(): void {}

  initializeForm() {
    this.companyForm = this.fb.group({
      enterpriseName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      country: ['', Validators.required],
      currency: ['', Validators.required],
      description: [''],
      amount: [null, [Validators.required, Validators.min(0)]],
    });

    this.companyForm.valueChanges.subscribe(val => {
      localStorage.setItem('companyFormData', JSON.stringify(val));
    });
  }

  loadSavedFormData() {
    const savedData = localStorage.getItem('companyFormData');
    if (savedData) {
      try {
        const formData = JSON.parse(savedData);
        this.companyForm.patchValue(formData);
      } catch (e) {
        console.error('Erreur lors du chargement des données sauvegardées', e);
        this.clearSavedData();
      }
    }
  }

  submit() {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;
    console.log('Soumission du formulaire', this.companyForm.value);
    
    if (this.companyForm.valid) {
      this.companyService.create(this.companyForm.value).subscribe({
        next: (createdCompany: Company) => {
          if (!createdCompany?.id) {
            console.error('Company ID est undefined', createdCompany);
            this.toastrService.danger('Erreur lors de la création', 'Erreur');
            return;
          }

          this.handleSuccess(createdCompany);
        },
        error: (err) => {
          console.error('Erreur lors de la création:', err);
          this.isSubmitting = false;
          
          if (err.status === 500) {
            const errorMsg = err.error?.detail || 'Erreur serveur (la company a peut-être été créée)';
            this.toastrService.warning(errorMsg, 'Attention');
            
            this.checkIfCompanyWasCreated();
          } else {
            this.toastrService.danger(
              err.error?.message || 'Erreur lors de la création', 
              'Erreur'
            );
          }
        },
        complete: () => this.isSubmitting = false
      });
    } else {
      this.markFormAsTouched();
      this.isSubmitting = false;
    }
  }

  private handleSuccess(company: Company) {
    console.log('Company créée avec succès:', company);
    
    localStorage.setItem('selectedCompanyId', company.id!);
    localStorage.setItem('selectedCompany', JSON.stringify(company));
    localStorage.removeItem('companyFormData');
    
    this.selectedCompany = company;
    this.showDetail = true;
    this.isSubmitting = false;
    
    this.toastrService.success(
      'Company créée avec succès', 
      'Succès', 
      { duration: 3000 }
    );
  }

  private checkIfCompanyWasCreated() {

  }

  private markFormAsTouched() {
    Object.values(this.companyForm.controls).forEach(control => {
      control.markAsTouched();
    });
    this.toastrService.danger('Veuillez corriger les erreurs dans le formulaire', 'Formulaire invalide');
  }

  clearSavedData() {
    localStorage.removeItem('companyFormData');
    this.companyForm.reset();
  }
}