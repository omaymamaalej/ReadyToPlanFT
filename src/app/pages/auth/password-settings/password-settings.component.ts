import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordChangeDTO } from 'src/app/models/PasswordChange';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-password-settings',
  templateUrl: './password-settings.component.html',
  styleUrls: ['./password-settings.component.css']
})
export class PasswordSettingsComponent implements OnInit {
  pwdChange: PasswordChangeDTO = {
    currentPassword: '',
    newPassword: '',
  };
  confirmPassword: string = '';

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  updatePassword() {
    if (this.pwdChange.newPassword !== this.confirmPassword) {
      alert("New password and confirmation don't match!");
      return;
    }

    this.accountService.updatePwd(this.pwdChange).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Error changing password: ' + (err.error?.message || err.message));
      },
    });
  }
}