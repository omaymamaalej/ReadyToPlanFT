import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessPlanFinalComponent } from './business-plan-final.component';

describe('BusinessPlanFinalComponent', () => {
  let component: BusinessPlanFinalComponent;
  let fixture: ComponentFixture<BusinessPlanFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessPlanFinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessPlanFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
