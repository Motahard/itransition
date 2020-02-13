import {Injectable} from "@angular/core";
import {Company} from "../models/company.class";
import {HttpClient, HttpParams} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {User, UserSettings} from "../models/user.class";
import {AuthService} from "./auth.service";
import {CompaniesService} from "./companies.service";

@Injectable({
  providedIn: "root"
})
export class UserService {
  userCompanies: BehaviorSubject<Company[]>;

  constructor(private http: HttpClient,
              private authService: AuthService,
              private companiesService: CompaniesService
  ) {
    this.userCompanies = new BehaviorSubject<Company[]>([]);
  }

  public setUserSettingsInLocalStorage(settings: UserSettings) {
    const localStorageSettings = JSON.parse(localStorage.getItem("settings"));
    if (!localStorageSettings) {
      localStorage.setItem("settings", JSON.stringify(settings));
      return;
    }
    let changeLSData = false;
    // tslint:disable-next-line:forin
    for (const i in localStorageSettings) {
      if (localStorageSettings.hasOwnProperty(i) && settings.hasOwnProperty(i)) {
        if (localStorageSettings[i] !== settings[i]) {
          changeLSData = true;
        }
      }
    }
    if (changeLSData) {
      localStorage.setItem("settings", JSON.stringify(settings));
    }
  }

  public deleteUserCompany(idCompany) {
    const params = new HttpParams().set("id", idCompany);
    const subscription = this.http.delete<Company[]>("/api/user/company", {
      params
    }).subscribe(companies => {
      this.userCompanies.next(companies);
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  public updateUserData(userData) {
    const settings: UserSettings = {
      theme: userData.theme,
      language: userData.language
    };
    const data: User = {
      name: userData.name,
      email: userData.email,
      id: userData.id
    };
    this.setUserSettingsInLocalStorage(settings);
    const subscription = this.http.put<User>("/api/user", data).subscribe(res => {
      this.authService.user.next(res);
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  public getUserCompanies(): void {
    const subscription = this.http.get<Company[]>(`/api/user/company`).subscribe(companies => {
      this.userCompanies.next(companies);
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  public commentLikeUser(commentId, companyId) {
    const subscription = this.http.post<User & Company>("/api/user/likes", {
      commentId,
      companyId
    }).subscribe(res => {
      // @ts-ignore
      this.authService.user.next(res.savedUser);
      // @ts-ignore
      this.companiesService.companyMessages.next(res.savedCompanyMessages);
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }
}
