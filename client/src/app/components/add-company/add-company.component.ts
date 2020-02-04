import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { User } from "../../models/user.class";

@Component({
  selector: "app-add-company",
  templateUrl: "./add-company.component.html",
  styleUrls: ["./add-company.component.scss"]
})
export class AddCompanyComponent implements OnInit, OnDestroy {
  user: User;
  userSub$: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userSub$ = this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  createCompany() {
    if (!this.user) {
      this.router.navigate(["/login"]);
      return;
    }

    this.router.navigate(["/create-company"]);
  }

  ngOnDestroy() {
    this.userSub$.unsubscribe();
  }
}
