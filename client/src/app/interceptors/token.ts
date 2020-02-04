import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";
import { Observable, Subscription } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  token: string;
  tokenSub$: Subscription;

  constructor(private authService: AuthService) {
    this.tokenSub$ = this.authService.token.subscribe(token => {
      this.token = token;
    });
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.token) {
      const userToken = this.token;
      const modifiedReq = req.clone({
        headers: req.headers.set("auth-token", userToken)
      });
      return next.handle(modifiedReq);
    } else {
      return next.handle(req);
    }
  }
}
