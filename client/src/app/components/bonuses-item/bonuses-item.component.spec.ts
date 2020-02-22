import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BonusesItemComponent } from "./bonuses-item.component";

describe("BonusesItemComponent", () => {
  let component: BonusesItemComponent;
  let fixture: ComponentFixture<BonusesItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonusesItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusesItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
