import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBusinessPlanComponent } from './list-business-plan.component';

describe('ListBusinessPlanComponent', () => {
  let component: ListBusinessPlanComponent;
  let fixture: ComponentFixture<ListBusinessPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListBusinessPlanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListBusinessPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
