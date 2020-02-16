import { Component, OnInit, OnDestroy } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { CompaniesService } from "src/app/services/companies.service";
import { Subscription } from "rxjs";
import { Company } from "src/app/models/company.class";
import {User} from "../../models/user.class";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: "app-company-page",
  templateUrl: "./company-page.component.html",
  styleUrls: ["./company-page.component.scss"]
})
export class CompanyPageComponent implements OnInit, OnDestroy {
  public id: string;
  private companySub$: Subscription;
  private userSub$: Subscription;
  public user: User;
  public userLikeRate: number;
  public company: Company;
  public daysRemain: number;
  public amount: string;
  public showNews: boolean;
  public showComments: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private companiesService: CompaniesService,
    private authService: AuthService
  ) {
    const show = activatedRoute.snapshot.children[0] ? activatedRoute.snapshot.children[0].url[0].path : undefined;
    if (show && show === "comments") {
      this.showComments = true;
    } else if (show && show === "news") {
      this.showNews = true;
    }
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.companySub$ = this.companiesService.company.subscribe(company => {
      this.company = company;
      if (company) {
        this.amount = this.companiesService.getPercentCompletion(company);
        this.daysRemain = this.companiesService.getRemainTime(company);
      }
    });
    this.userSub$ = this.authService.user.subscribe(user => {
      this.user = user;
      if (this.user) {
        this.user.rates.forEach(rate => {
          if (rate.company === this.id) {
            this.userLikeRate = rate.rate;
          }
        });
      }
    });
  }

  ngOnInit() {
    this.companiesService.getCompany(this.id);
  }

  onStarClick(event) {
    const rate = event.target.getAttribute("name");
    this.companiesService.addNewRate(rate, this.id, this.user.id);
  }

  ngOnDestroy() {
    this.company = null;
    this.companySub$.unsubscribe();
  }
}
