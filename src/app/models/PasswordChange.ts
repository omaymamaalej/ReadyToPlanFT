export class PasswordChange {
  currentPassword: string;
  newPassword: string;

  constructor() {
    this.currentPassword = '';
    this.newPassword = '';
  }
}

export interface PasswordChangeDTO {
  currentPassword: string;
  newPassword: string;
}