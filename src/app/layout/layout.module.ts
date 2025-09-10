import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { HeaderComponent } from './header/header.component';
import { NbActionsModule, NbContextMenuModule, NbIconModule, NbLayoutModule, NbMenuModule, NbOptionModule, NbPopoverModule, NbSearchModule, NbSelectModule, NbSidebarModule, NbUserModule } from '@nebular/theme';
import { LayoutComponent } from './layout.component';


@NgModule({
  declarations: [
    HeaderComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    NbActionsModule,
    NbSearchModule,
    NbOptionModule,
    NbSidebarModule,
    NbLayoutModule,
    NbIconModule,
    NbSelectModule,
    NbUserModule,
    NbMenuModule,
    NbContextMenuModule,
    NbPopoverModule
    
    

  ],
  exports: [
    HeaderComponent,
    LayoutComponent
  ]
})
export class LayoutModule { }
