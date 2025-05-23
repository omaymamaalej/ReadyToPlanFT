import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-presentation-dialog',
  templateUrl: './presentation-dialog.component.html',
  styleUrls: ['./presentation-dialog.component.css']
})
export class PresentationDialogComponent {

  @Input() businessPlanName!: string;
  @Input() presentationContent!: string;

  constructor(protected dialogRef: NbDialogRef<PresentationDialogComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
