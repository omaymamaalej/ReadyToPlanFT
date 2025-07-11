import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingDetailComponent } from './marketing-detail.component';

describe('MarketingDetailComponent', () => {
  let component: MarketingDetailComponent;
  let fixture: ComponentFixture<MarketingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
