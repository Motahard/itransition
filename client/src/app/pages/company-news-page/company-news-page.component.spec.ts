import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNewsPageComponent } from './company-news-page.component';

describe('CompanyNewsPageComponent', () => {
  let component: CompanyNewsPageComponent;
  let fixture: ComponentFixture<CompanyNewsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyNewsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyNewsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
