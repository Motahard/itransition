import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyCommentsPageComponent } from './company-comments-page.component';

describe('CompanyCommentsPageComponent', () => {
  let component: CompanyCommentsPageComponent;
  let fixture: ComponentFixture<CompanyCommentsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyCommentsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyCommentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
