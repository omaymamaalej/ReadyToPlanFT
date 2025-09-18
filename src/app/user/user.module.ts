import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '../layout/layout.module';
import { NbBadgeModule, NbButtonModule, NbCardModule, NbIconModule, NbLayoutModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ListUserComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    HttpClientModule,  
    LayoutModule,
    NbCardModule,
    NbIconModule,
    FormsModule,
    NgxPaginationModule,
    NbLayoutModule,
    NbSpinnerModule,
    NbSelectModule,
    NbButtonModule,
    NbBadgeModule


  ],
  exports: [
    ListUserComponent
  ],

  providers: [DatePipe]
})
export class UserModule { }
