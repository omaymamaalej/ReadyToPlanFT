import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NB_DIALOG_CONFIG, NbDialogRef } from '@nebular/theme';
import { BusinessPlanFinal, BusinessPlanFinalDTO } from 'src/app/models/BusinessPlanFinal';
import { BusinessPlanFinalService } from 'src/app/services/business-plan-final.service';

@Component({
  selector: 'app-update-business-plan-final',
  templateUrl: './update-business-plan-final.component.html',
  styleUrls: ['./update-business-plan-final.component.css']
})
export class UpdateBusinessPlanFinalComponent implements OnInit {
  @Input() businessPlanFinal!: BusinessPlanFinal;
  formGroup!: FormGroup;
  constructor(
    @Inject(NB_DIALOG_CONFIG) public data: { businessPlanFinal: BusinessPlanFinalDTO },
    public dialogRef: NbDialogRef<UpdateBusinessPlanFinalComponent>,
    private businessPlanService: BusinessPlanFinalService,
    private fb: FormBuilder
  ) {
    this.businessPlanFinal = { ...data.businessPlanFinal }; // ✅ clone pour éviter tout effet de bord
  }
  ngOnInit(): void {
    console.log("Données reçues : ", this.businessPlanFinal);

    const creationDate = this.businessPlanFinal.creationDate
      ? new Date(this.businessPlanFinal.creationDate).toISOString()
      : '';


    this.formGroup = this.fb.group({
      id: [this.businessPlanFinal.id || ''],
      title: [this.businessPlanFinal.title || '', Validators.required],
      finalContent: [this.businessPlanFinal.finalContent || '', Validators.required],
      creationDate: [creationDate]


    });

    console.log("Formulaire initialisé :", this.formGroup.value);

  }


  onUpdate(): void {
    const rawValues = this.formGroup.value;

    const updatedPlan: BusinessPlanFinal = {
      ...rawValues,
      creationDate: rawValues.creationDate
        ? new Date(rawValues.creationDate).toISOString()
        : null,
      id: this.businessPlanFinal.id  // s'assurer que l'ID est bien présent
    };

    if (!updatedPlan.id) {
      console.error("L'ID est manquant dans l'objet à mettre à jour !");
      return;
    }

    this.businessPlanService.update(updatedPlan).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err) => console.error('Erreur de mise à jour :', err)
    });
  }




}