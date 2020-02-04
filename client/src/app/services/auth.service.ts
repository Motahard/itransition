import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, BehaviorSubject } from "rxjs";
import { User } from "../models/user.class";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  user: Subject<User>;
  token: BehaviorSubject<string>;
  errorRegister: BehaviorSubject<string>;
  errorLogin: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.user = new Subject<User>();
    this.token = new BehaviorSubject<string>(this.getTokenFromLocalStorage());
    this.errorRegister = new BehaviorSubject<string>(null);
    this.errorLogin = new BehaviorSubject<string>(null);
  }

  setTokenInLocalStorage(token): void {
    localStorage.setItem("token", JSON.stringify(token));
  }

  getTokenFromLocalStorage(): string {
    return JSON.parse(localStorage.getItem("token"));
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
        },
        (err: HttpErrorResponse) => {
          this.errorLogin.next(err.error);
        }
      );
  }

  getUser(): void {
    this.http.get<User>("/api/user").subscribe(
      res => {
        this.user.next(res);
      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
      }
    );
  }

  userLogout() {
    this.removeTokenFromLocalStorage();
    this.user.next(null);
    this.token.next(null);
  }
}
