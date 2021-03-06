import {Component, OnDestroy} from "@angular/core";
import {AuthService} from "./services/auth.service";
import {User} from "./models/user.class";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {CompaniesService} from "./services/companies.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnDestroy {
  user: User;
  userSub$: Subscription;

  constructor(private authService: AuthService,
              private companiesService: CompaniesService,
              private router: Router) {
    this.companiesService.getCompanies();
    this.userSub$ = this.authService.user.subscribe(user => {
      this.user = user;
      if (this.user && this.user.blocked) {
        this.router.navigate(["/404"]);
      }
    });
    this.authService.checkForTokenAndGetUser();
  }

  ngOnDestroy(): void {
    this.userSub$.unsubscribe();
  }
}
