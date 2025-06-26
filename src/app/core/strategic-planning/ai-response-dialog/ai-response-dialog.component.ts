import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-ai-response-dialog',
  templateUrl: './ai-response-dialog.component.html',
  styleUrls: ['./ai-response-dialog.component.css']
})
export class AiResponseDialogComponent {

   @Input() aiResponse!: string;

  constructor(protected dialogRef: NbDialogRef<AiResponseDialogComponent>) {}

}
