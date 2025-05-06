import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbButtonModule, NbIconModule, NbLayoutModule, NbMenuModule, NbSelectModule, NbThemeModule, NbUserModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AuthModule } from './pages/auth/auth.module';
import { NbAuthModule } from '@nebular/auth';
import { ComponentsModule } from './components/components.module';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbLayoutModule,
    NbEvaIconsModule,
    AuthModule,
    NbMenuModule,
    NbUserModule,
    NbButtonModule,
    NbSelectModule,
    NbIconModule,
    ComponentsModule,

    NbThemeModule.forRoot({
      name: 'default', 
    }),
    NbAuthModule.forRoot({
      strategies: [],
      forms: {},
    }),

  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    ComponentsModule
  ],
})
export class AppModule { }
