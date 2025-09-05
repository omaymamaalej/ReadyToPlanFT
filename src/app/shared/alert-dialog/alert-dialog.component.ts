import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-alert-dialog',
  template: `
    <nb-card [status]="status" class="dialog-card">
      <nb-card-header>
        <nb-icon [icon]="icon"></nb-icon> {{ title }}
      </nb-card-header>
      <nb-card-body>
        <p>{{ message }}</p>
      </nb-card-body>
      <nb-card-footer>
        <button nbButton status="primary" (click)="close()">OK</button>
      </nb-card-footer>
    </nb-card>
  `,
  styles: [`
    // .dialog-card { width: 400px; text-align: center; }
    nb-card-footer { display: flex; justify-content: center; }
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

  `]
})
export class AlertDialogComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() icon = 'info-outline';
  @Input() status: any = 'primary';

  constructor(protected ref: NbDialogRef<AlertDialogComponent>) {}

  close() { this.ref.close(); }
}
  

