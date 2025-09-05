import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <nb-card [status]="status" class="dialog-card">
      <nb-card-header>
        <nb-icon [icon]="icon"></nb-icon> {{ title }}
      </nb-card-header>
      <nb-card-body>
        <p>{{ message }}</p>
      </nb-card-body>
      <nb-card-footer class="dialog-footer">
        <button nbButton status="primary" (click)="confirm()">{{ confirmText }}</button>
        <button nbButton status="basic" (click)="cancel()">{{ cancelText }}</button>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [`
    // .dialog-card { width: 400px; text-align: center; }
    .dialog-footer { display: flex; justify-content: space-around; }
    .dialog-card {
      width: 420px;
      border-radius: 14px;
      text-align: center;
      box-shadow: 0 8px 20px rgba(0,0,0,0.15);
      overflow: hidden;
    }

    nb-card-header {
      font-weight: 600;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    nb-card-body p {
      font-size: 1rem;
      color: #444;
      margin: 1rem 0;
    }

    nb-card-footer {
      display: flex;
      justify-content: center;
      gap: 12px;
      padding: 1rem;
    }

    nb-card-footer button {
      min-width: 120px;
      border-radius: 8px;
      font-weight: 500;
    }

  `],
  
})
export class ConfirmDialogComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() icon = 'alert-triangle-outline';
  @Input() status: any = 'primary';

  constructor(protected ref: NbDialogRef<ConfirmDialogComponent>) {}

  confirm() { this.ref.close(true); }
  cancel() { this.ref.close(false); }
}