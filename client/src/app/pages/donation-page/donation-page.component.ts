import { Component, OnInit } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CompaniesService} from "../../services/companies.service";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.class";
import {Subscription} from "rxjs";
import {
  IPayPalConfig,
  ICreateOrderRequest
} from "ngx-paypal";

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
  public payPalConfig ?: IPayPalConfig;
  error: string;

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
    this.initConfig();
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: "USD",
      clientId: "Ae1fGBeJvmiNqN9PLD96olrPblxLTRnjihk-GtNubCGftqHwL2_zAL4HwQ2oc1Ctsv8-8iQpksoRBt0y",
      createOrderOnClient: (data) => < ICreateOrderRequest > {
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: this.donateSum.toString(),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: this.donateSum.toString()
              }
            }
          },
          items: [{
            name: this.idBonuse,
            quantity: "1",
            category: "DIGITAL_GOODS",
            unit_amount: {
              currency_code: "USD",
              value: this.donateSum.toString(),
            },
          }]
        }]
      } as ICreateOrderRequest,
      advanced: {
        commit: "true"
      },
      style: {
        label: "paypal",
        layout: "vertical"
      },
      onApprove: (data, actions) => {
        actions.order.get().then(details => {
          this.error = "Donation must be greater then zero";
          this.companiesService.donateCompanyAdd(this.donateSum, this.idCompany);
          this.userService.donateUserAdd(this.donateSum, this.idCompany);
          if (this.idBonuse.length > 1) {
            this.userService.addBonuse(this.idBonuse, this.idCompany);
          }
          this.router.navigate([`/company/${this.idCompany}`]);
        });

      },
      onClientAuthorization: (data) => {
      },
      onCancel: (data, actions) => {
        this.error = "";
      },
      onError: err => {
        this.error = "Donation must be greater then zero";
      },
      onClick: (data, actions) => {
      },
    };
  }
}
