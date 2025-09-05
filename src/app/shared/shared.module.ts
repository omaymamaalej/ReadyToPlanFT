import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineBreaksPipe } from './pipes/line-breaks.pipe';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { NbCardModule, NbIconModule } from '@nebular/theme';



@NgModule({
  declarations: [
    LineBreaksPipe,
    AlertDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbIconModule,
    
],
  exports: [LineBreaksPipe]
})
export class SharedModule { }
