import { Component } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { ADMIN_MENU_ITEMS, USER_MENU_ITEMS } from './@core/data/menu.data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ReadyToPlanFT';


}