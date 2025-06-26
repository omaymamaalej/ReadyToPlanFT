import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPlanPresentationDialogComponent } from './business-plan-presentation-dialog.component';

describe('BusinessPlanPresentationDialogComponent', () => {
  let component: BusinessPlanPresentationDialogComponent;
  let fixture: ComponentFixture<BusinessPlanPresentationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessPlanPresentationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPlanPresentationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
