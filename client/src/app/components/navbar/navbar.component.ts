import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";
import { User } from "../../models/user.class";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit, OnDestroy {
  user: User;
  userSub$: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSub$ = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.authService.checkForTokenAndGetUser();
  }

  onLogoutClick() {
    this.authService.userLogout();
  }

  ngOnDestroy() {
    this.userSub$.unsubscribe();
  }
}
