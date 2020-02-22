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
  tags$: Subscription;
  tags: string[];
  searchStr: string;

  constructor(private companiesService: CompaniesService) {
    this.searchStr = "";
    this.companiesSub$ = this.companiesService.companies.subscribe(
      companies => {
        this.companies = companies;
      }
    );
  }

  ngOnInit() {
    this.companiesService.getCompanies();
    this.tags$ = this.companiesService.getTags().subscribe(res => {
      this.tags = res;
    });
  }

  sortBy(field) {
    if (field === "new") {
      this.companies = this.companies.sort((a, b) => {
        return b.dateStart - a.dateStart;
      });
    } else if (field === "old") {
      this.companies = this.companies.sort((a, b) => {
        return a.dateStart - b.dateStart;
      });
    } else if (field === "rate") {
     this.companies = this.companies.sort((a, b) => {
        const aRate = a.rates.rate / a.rates.count;
        const bRate = b.rates.rate / b.rates.count;
        if (aRate - bRate < 0) {
          return 1;
        } else if (aRate - bRate === 0) {
          return 0;
        } else {
          return -1;
        }
      });
    }
  }

  onSearchClick() {
    const subscription = this.companiesService.searchingCompanies(this.searchStr).subscribe(res => {
      this.companies = res;
    }, err => {
      console.log(err);
    }, () => {
      subscription.unsubscribe();
    });
    this.searchStr = "";
  }

  ngOnDestroy() {
    this.companiesSub$.unsubscribe();
  }
}
