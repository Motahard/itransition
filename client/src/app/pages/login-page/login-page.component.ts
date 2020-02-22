import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"]
})
export class LoginPageComponent implements OnInit, OnDestroy {
  email: string;
  password: string;
  tokenSub$: Subscription;
  token: string;
  errorSub$: Subscription;
  error: string;

  constructor(private authService: AuthService,
              private router: Router) {}

  ngOnInit() {
    this.errorSub$ = this.authService.errorLogin.subscribe(err => {
      this.error = err;
    });
    this.tokenSub$ = this.authService.token.subscribe(token => {
      this.token = token;
      this.redirectIfToken();
    });
    this.redirectIfToken();
  }

  redirectIfToken() {
    if (this.token) {
      this.router.navigate(["/"]);
    }
  }

  onSubmit() {
    this.authService.userLogin({
      email: this.email,
      password: this.password
    });

    this.email = this.password = "";
  }

  ngOnDestroy() {
    this.tokenSub$.unsubscribe();
  }
}
