import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBusinessPlanFinalComponent } from './update-business-plan-final.component';

describe('UpdateBusinessPlanFinalComponent', () => {
  let component: UpdateBusinessPlanFinalComponent;
  let fixture: ComponentFixture<UpdateBusinessPlanFinalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBusinessPlanFinalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateBusinessPlanFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
