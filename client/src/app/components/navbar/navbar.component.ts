import { Component, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";
import { User } from "../../models/user.class";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnDestroy {
  user: User;
  userSub$: Subscription;
  activeLink: string;

  constructor(private authService: AuthService) {
    this.activeLink = "home";
    this.userSub$ = this.authService.user.subscribe(user => {
      this.user = user;
    });
  }

  onLogoutClick() {
    this.authService.userLogout();
  }

  ngOnDestroy() {
    this.userSub$.unsubscribe();
  }
}
