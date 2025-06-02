import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { Country } from 'src/app/enumerations/country.enum';
import { Currency } from 'src/app/enumerations/currency.enum';
import { Languages } from 'src/app/enumerations/languages.enum';
import { BusinessPlan } from 'src/app/models/BusinessPlan';
import { BusinessPlanService } from 'src/app/services/business-plan.service';

@Component({
  selector: 'app-add-business-plan',
  templateUrl: './add-business-plan.component.html',
  styleUrls: ['./add-business-plan.component.css']
})
export class AddBusinessPlanComponent implements OnInit {

  starRate = 2;
  heartRate = 4;
  radioGroupValue = 'This is value 2';
  businessPlanForm!: FormGroup;
  countries = Object.entries(Country);
  languages = Object.entries(Languages);
  currencies = Object.entries(Currency);

  constructor(private builder: FormBuilder,
    private businessPlanService: BusinessPlanService,
    private router: Router,
    private fb: FormBuilder) {

      this.businessPlanForm = this.fb.group({
      companyName: ['', Validators.required],
      companyStartDate: [null, Validators.required],
      country: [null, Validators.required],
      languages: [Languages.ENGLISH, Validators.required],
      companyDescription: [''],
      anticipatedProjectSize: [0, [Validators.required, Validators.min(0)]],
      currency: [Currency.EUR, Validators.required],
    });
  }

  ngOnInit() {}

  submit() {
    this.businessPlanService.create(this.businessPlanForm.value)
      .subscribe({
        next: (data) => {
          this.router.navigate(['/home/businessPlan/listBusinessPlan']);
          console.log('success .....');
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
  
}
