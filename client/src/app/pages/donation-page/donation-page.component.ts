import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CompaniesService} from "../../services/companies.service";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.class";
import {Subscription} from "rxjs";

@Component({
  selector: "app-donation-page",
  templateUrl: "./donation-page.component.html",
  styleUrls: ["./donation-page.component.scss"]
})
export class DonationPageComponent implements OnInit {
  price: number;
  donateSum: number;
  idBonuse: string;
  idCompany: string;
  user: User;
  user$: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private companiesService: CompaniesService,
              private userService: UserService,
              private authService: AuthService
              ) {
    this.user$ = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.idBonuse = this.route.snapshot.paramMap.get("idBonuse");
    this.price = +this.route.snapshot.paramMap.get("price");
    this.donateSum = this.price;
    this.idCompany = this.route.snapshot.paramMap.get("id"); }

  ngOnInit() {
  }

  onDonateClick() {
    if (!this.user) {
      return;
    }
    const sum = this.donateSum;

    this.companiesService.donateCompanyAdd(sum, this.idCompany);
    this.userService.donateUserAdd(sum, this.idCompany);
    if (this.idBonuse.length > 1) {
      this.userService.addBonuse(this.idBonuse, this.idCompany);
    }
    this.router.navigate([`/company/${this.idCompany}`]);
  }


}
