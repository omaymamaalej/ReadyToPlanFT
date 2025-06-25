import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordChangeDTO } from 'src/app/models/PasswordChange';
import { User } from 'src/app/models/User';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  currentUser: User = {
    id: '',
    login: '',
    firstName: '',
    lastName: '',
    email: '',
    activated: false,
    langKey: '',
    authorities: [],
    createdBy: '',
    createdDate: new Date(),
    lastModifiedBy: '',
    lastModifiedDate: new Date(),
  };

 
  constructor(
    private accountService: AccountService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserAccount();
  }

  getUserAccount(): void {
    this.accountService.getAccount().subscribe({
      next: (response: User) => {
        this.currentUser = response;
        console.log(this.currentUser);
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }

  update() {
    this.accountService.updateAccount(this.currentUser).subscribe({
      next: (data) => {
        this.router.navigate(['/account']);
      },
      error: (err) => {
        console.log(err);
      },
    });
    
  }
}
