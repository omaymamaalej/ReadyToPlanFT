import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBusinessPlanComponent } from './update-business-plan.component';

describe('UpdateBusinessPlanComponent', () => {
  let component: UpdateBusinessPlanComponent;
  let fixture: ComponentFixture<UpdateBusinessPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBusinessPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateBusinessPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
