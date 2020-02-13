import { Component, OnInit, Input } from "@angular/core";
import { Company } from "src/app/models/company.class";
import {CompaniesService} from "../../services/companies.service";

@Component({
  selector: "app-company-item",
  templateUrl: "./company-item.component.html",
  styleUrls: ["./company-item.component.scss"]
})
export class CompanyItemComponent implements OnInit {
  @Input() company: Company;
  daysRemain: number;
  amount: string;

  constructor(private companiesService: CompaniesService) {}

  ngOnInit() {
      this.amount = this.companiesService.getPercentCompletion(this.company);
      this.daysRemain = this.companiesService.getRemainTime(this.company);
  }
}
