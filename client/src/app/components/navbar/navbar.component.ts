import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService, User } from "src/app/services/auth.service";
import { Subscription } from "rxjs";

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
  }

  onLogoutClick() {
    this.authService.userLogout();
  }

  ngOnDestroy() {
    this.userSub$.unsubscribe();
  }
}
