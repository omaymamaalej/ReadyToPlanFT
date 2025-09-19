import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbButtonModule, NbIconModule, NbLayoutModule, NbMenuModule, NbSelectModule, NbSidebarModule, NbThemeModule, NbUserModule, NbActionsModule, NbDatepickerModule, NbDialogModule, NbCardModule, NbToastrModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AuthModule } from './pages/auth/auth.module';
import { NbAuthModule } from '@nebular/auth';
import { LayoutService } from './@core/utils/layout.service';
import { FeaturesModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { ZonedDateTimeInterceptorProviders } from './_helpers/ZonedDateTime.interceptor';
import { NbSecurityModule } from '@nebular/security';
import { SharedModule } from './shared/shared.module';
import { MarkdownModule } from 'ngx-markdown';
import { UserModule } from './user/user.module';

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
    NbUserModule,
    NbCardModule,
    NbButtonModule,
    NbSelectModule,
    NbIconModule,
    NbToastrModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbActionsModule,
    MarkdownModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbSecurityModule.forRoot({
      accessControl: {
        guest: {
          view: '*',
        },
        user: {
          parent: 'guest',
          create: '*',
          edit: '*',
          remove: '*',
        },
      },
    }),


    NbThemeModule.forRoot({
      name: 'default',
    }),
    NbAuthModule.forRoot({
      strategies: [],
      forms: {},
    }),
    FeaturesModule,
    LayoutModule,
    SharedModule,
    UserModule

  ],
  providers: [LayoutService, authInterceptorProviders, ZonedDateTimeInterceptorProviders],
  bootstrap: [AppComponent],
  exports: [
  ],

})
export class AppModule { }
