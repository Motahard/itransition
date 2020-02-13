import {Injectable} from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { User } from "../models/user.class";

@Injectable()
export class AuthService {
  user: BehaviorSubject<User>;
  token: BehaviorSubject<string>;
  errorRegister: BehaviorSubject<string>;
  errorLogin: BehaviorSubject<string>;

  constructor(private http: HttpClient) {
    this.user = new BehaviorSubject<User>(null);
    this.token = new BehaviorSubject<string>(this.getTokenFromLocalStorage());
    this.errorRegister = new BehaviorSubject<string>(null);
    this.errorLogin = new BehaviorSubject<string>(null);
  }

   private setTokenInLocalStorage(token): void {
    localStorage.setItem("token", JSON.stringify(token));
  }

  public checkForTokenAndGetUser(): void {
    const token = this.getTokenFromLocalStorage();
    if (token) {
      this.getUser();
    }
  }

  private getTokenFromLocalStorage(): string {
    return JSON.parse(localStorage.getItem("token"));
  }

  private removeTokenFromLocalStorage(): void {
    localStorage.removeItem("token");
  }

  public userRegister(userCredentials): void {
    const subsciption = this.http
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
        },
        () => subsciption.unsubscribe()
      );
  }

  public userLogin(userCredentials): void {
    const subscription = this.http
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
        },
        () => subscription.unsubscribe()
      );
  }

  public getUser(): void {
    this.http
      .get<User>("/api/user")
      .toPromise()
      .then(res => {
        this.user.next(res);
      })
      .catch(error => console.log(error.message));
  }

  public userLogout() {
    this.removeTokenFromLocalStorage();
    this.user.next(null);
    this.token.next(null);
  }
}
