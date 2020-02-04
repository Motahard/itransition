import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-registration-page",
  templateUrl: "./registration-page.component.html",
  styleUrls: ["./registration-page.component.scss"]
})
export class RegistrationPageComponent implements OnInit, OnDestroy {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  errorSub$: Subscription;
  error: string;
  tokenSub$: Subscription;
  token: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.errorSub$ = this.authService.errorRegister.subscribe(err => {
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
    if (this.password !== this.confirmPassword) {
      this.authService.errorRegister.next("Password do not match");
      return;
    }
    this.authService.userRegister({
      email: this.email,
      name: this.name,
      password: this.password
    });

    this.email = this.name = this.password = this.confirmPassword = "";
  }

  ngOnDestroy() {
    this.tokenSub$.unsubscribe();
  }
}
