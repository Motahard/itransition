import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject, Subscription, Observable } from "rxjs";
import { User } from "../models/user.class";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user: BehaviorSubject<User>;
  token: BehaviorSubject<string>;
  errorRegister: BehaviorSubject<string>;
  errorLogin: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.user = new BehaviorSubject<User>(undefined);
    this.token = new BehaviorSubject<string>(this.getTokenFromLocalStorage());
    this.errorRegister = new BehaviorSubject<string>(undefined);
    this.errorLogin = new BehaviorSubject<string>(undefined);
  }

  setTokenInLocalStorage(token): void {
    localStorage.setItem("token", JSON.stringify(token));
  }

  getTokenFromLocalStorage(): string {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) this.getUser();
    return token;
  }

  removeTokenFromLocalStorage(): void {
    localStorage.removeItem("token");
  }

  userRegister(userCredentials): void {
    this.http
      .post(
        "/api/register",
        {
          ...userCredentials
        },
        {
          observe: "response"
        }
      )
      .subscribe(
        res => {
          const authToken = res.headers.get("auth-token");
          this.setTokenInLocalStorage(authToken);
          this.token.next(authToken);
          this.errorRegister.next(null);
          this.getUser();
        },
        (err: HttpErrorResponse) => {
          this.errorRegister.next(err.error);
        }
      );
  }

  userLogin(userCredentials): void {
    this.http
      .post(
        "/api/login",
        {
          ...userCredentials
        },
        {
          observe: "response"
        }
      )
      .subscribe(
        res => {
          const authToken = res.headers.get("auth-token");
          this.setTokenInLocalStorage(authToken);
          this.token.next(authToken);
          this.errorLogin.next(null);
          this.getUser();
        },
        (err: HttpErrorResponse) => {
          this.errorLogin.next(err.error);
        }
      );
  }

  getUser(): void {
    this.http
      .get<User>("/api/user")
      .toPromise()
      .then(res => {
        this.user.next(res);
      })
      .catch(error => console.log(error.message));
  }

  userLogout() {
    this.removeTokenFromLocalStorage();
    this.user.next(null);
    this.token.next(null);
  }
}
