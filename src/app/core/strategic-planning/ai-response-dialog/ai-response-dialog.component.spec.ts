import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiResponseDialogComponent } from './ai-response-dialog.component';

describe('AiResponseDialogComponent', () => {
  let component: AiResponseDialogComponent;
  let fixture: ComponentFixture<AiResponseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AiResponseDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiResponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
