import { Component, OnInit, OnDestroy } from "@angular/core";
import { Company } from "src/app/models/company.class";
import { CompaniesService } from "src/app/services/companies.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-companies",
  templateUrl: "./companies.component.html",
  styleUrls: ["./companies.component.scss"]
})
export class CompaniesComponent implements OnInit, OnDestroy {
  companiesSub$: Subscription;
  companies: Company[];

  constructor(private companiesService: CompaniesService) {
    this.companiesSub$ = this.companiesService.companies.subscribe(
      companies => {
        this.companies = companies;
      }
    );
  }

  ngOnInit() {
    this.companiesService.getCompanies();
  }

  ngOnDestroy() {
    this.companiesSub$.unsubscribe();
  }
}
