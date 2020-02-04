import { Component, OnInit, Input } from "@angular/core";
import { Company } from "src/app/models/company.class";

@Component({
  selector: "app-company-item",
  templateUrl: "./company-item.component.html",
  styleUrls: ["./company-item.component.scss"]
})
export class CompanyItemComponent implements OnInit {
  @Input() company: Company;

  amount: string;

  constructor() {}

  ngOnInit() {
    this.amount =
      ((this.company.currentAmount / this.company.amount) * 100)
        .toFixed()
        .toString() + "%";
  }
}
