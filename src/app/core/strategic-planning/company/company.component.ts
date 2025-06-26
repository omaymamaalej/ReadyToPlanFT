import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router
  ) {
    this.companyForm = this.fb.group({
      enterpriseName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{8,15}$/)]],
      country: ['', Validators.required],
      currency: ['', Validators.required],
      description: [''],
      amount: [null, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {

  }

  submit() {
    if (this.companyForm.valid) {
      this.companyService.create(this.companyForm.value).subscribe({
        next: (createdCompany: Company) => {
          if (!createdCompany.id) {
            console.error('Company ID is undefined');
            return;
          }

          localStorage.setItem('selectedCompanyId', createdCompany.id);
          localStorage.setItem('selectedCompany', JSON.stringify(createdCompany));

          this.selectedCompany = createdCompany;
          this.showDetail = true; // ✅ On affiche <app-company-detail>
        },
        error: (err) => console.error(err),
      });

    }
  }

}