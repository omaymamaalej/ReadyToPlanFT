import { Component, Inject, Input } from '@angular/core';
import { NB_DIALOG_CONFIG, NbDialogRef } from '@nebular/theme';
import { BusinessPlanFinalDTO } from 'src/app/models/BusinessPlanFinal';

@Component({
  selector: 'app-business-plan-presentation-dialog',
  templateUrl: './business-plan-presentation-dialog.component.html',
  styleUrls: ['./business-plan-presentation-dialog.component.css']
})
export class BusinessPlanPresentationDialogComponent {

  @Input() plan!: BusinessPlanFinalDTO;


  constructor(@Inject(NB_DIALOG_CONFIG) public data: any, 
  protected dialogRef: NbDialogRef<BusinessPlanPresentationDialogComponent>) {
    this.plan = data.plan;
  }
  close() {
    this.dialogRef.close();
  }
}
