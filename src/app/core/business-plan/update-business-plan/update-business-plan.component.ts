import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import * as dayjs from 'dayjs';
import { Country } from 'src/app/enumerations/country.enum';
import { Currency } from 'src/app/enumerations/currency.enum';
import { Languages } from 'src/app/enumerations/languages.enum';
import { BusinessPlan } from 'src/app/models/BusinessPlan';
import { BusinessPlanService } from 'src/app/services/business-plan.service';

@Component({
  selector: 'app-update-business-plan',
  templateUrl: './update-business-plan.component.html',
  styleUrls: ['./update-business-plan.component.css']
})
export class UpdateBusinessPlanComponent implements OnInit {
  @Input() businessPlan!: BusinessPlan;

  title: string = 'Edit Business Plan';
  formGroup!: FormGroup;

  countries = Object.entries(Country);
  languages = Object.entries(Languages);
  currencies = Object.entries(Currency);

  businessPlanForm: BusinessPlan = {

    id: '',
    companyName: '',
    companyStartDate: dayjs(),
    country: Country.FRANCE,
    languages: Languages.ENGLISH,
    companyDescription: '',
    anticipatedProjectSize: 0,
    currency: Currency.EUR,
  };

  constructor(private dialogService: NbDialogService,
    private businessPlanService: BusinessPlanService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dialogRef: NbDialogRef<UpdateBusinessPlanComponent>,
  ) {
    this.formGroup = this.fb.group({
      id: '',
      companyName: '',
      companyStartDate: dayjs(),
      country: Country.FRANCE,
      languages: Languages.ENGLISH,
      companyDescription: '',
      anticipatedProjectSize: 0,
      currency: Currency.EUR,
      regeneratePresentation: false
    });

  }

  ngOnInit(): void {
    if (this.businessPlan) {
      this.businessPlanForm = this.businessPlan;
      this.formGroup.patchValue(this.businessPlan);
    } else {
      this.route.paramMap.subscribe((param) => {
        var id = String(param.get('id'));
        this.getById(id);
      });
    }
  }


  getById(id: string) {
    this.businessPlanService.getById(id).subscribe((data) => {
      this.businessPlanForm = data;
      console.log("this.businessPlanForm", this.businessPlanForm);
      this.formGroup.patchValue({
        id: this.businessPlanForm.id,
        companyName: this.businessPlanForm.companyName,
        companyStartDate: this.businessPlanForm.companyStartDate,
        country: this.businessPlanForm.country,
        languages: this.businessPlanForm.languages,
        companyDescription: this.businessPlanForm.companyDescription,
        anticipatedProjectSize: this.businessPlanForm.anticipatedProjectSize,
        currency: this.businessPlanForm.currency,
        regeneratePresentation: false 
      });


    });
  }

  onUpdate(): void {
    const updatedPlan: BusinessPlan = {
      ...this.formGroup.value,
      id: this.businessPlan.id,
      regeneratePresentation: false 
    };

    this.businessPlanService.update(updatedPlan).subscribe({
      next: (updated) => {
        console.log('Business Plan updated without regenerating presentation');
        this.businessPlan = updated;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error during update:', err);
      }
    });
  }

  regeneratePresentation(): void {
    const updatedPlan: BusinessPlan = {
      ...this.formGroup.value,
      id: this.businessPlan.id,
      regeneratePresentation: true 
    };

    this.businessPlanService.update(updatedPlan).subscribe({
      next: (updated) => {
        this.dialogRef.close(true); // Indique que la mise à jour a eu lieu
      },
      error: (err) => {
        console.error('Error during regeneration:', err);
      }
    });
  }



  openWithoutBackdrop(dialog: TemplateRef<any>) {
    this.dialogService.open(
      dialog,
      {
        context: 'this is some additional data passed to dialog',
        hasBackdrop: false,
      });
  }

}
