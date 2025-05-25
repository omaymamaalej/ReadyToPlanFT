import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineBreaksPipe } from './pipes/line-breaks.pipe';



@NgModule({
  declarations: [
    LineBreaksPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [LineBreaksPipe]
})
export class SharedModule { }
