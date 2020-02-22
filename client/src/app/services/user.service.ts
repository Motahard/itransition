import {Injectable} from "@angular/core";
import {Bonuse, Company} from "../models/company.class";
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
  users: BehaviorSubject<User[]>;

  constructor(private http: HttpClient,
              private authService: AuthService,
              private companiesService: CompaniesService
  ) {
    this.userCompanies = new BehaviorSubject<Company[]>([]);
    this.users = new BehaviorSubject<User[]>([]);
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

  public getUserSettingsInLocalStorage() {
    return JSON.parse(localStorage.getItem("settings"));
  }

  public deleteUserCompany(idCompany) {
    const params = new HttpParams().set("id", idCompany);
    const subscription = this.http.delete<Company[]>("/api/user/company", {
      params
    }).subscribe(companies => {
      if (this.authService.user.getValue().permission !== 2) {
        this.userCompanies.next(companies);
      }
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  public updateUserData(userData, id) {
    const params = new HttpParams().set("id", id);
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
    const subscription = this.http.put<User>("/api/user", data, {
      params
    }).subscribe(res => {
      if (this.authService.user.getValue().permission !== 2) {
        this.authService.user.next(res);
      }
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  public getUserCompanies(idUser): void {
    const params = new HttpParams()
      .append("id", idUser);
    const subscription = this.http.get<Company[]>(`/api/user/company`, {
      params
    }).subscribe(companies => {
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
        this.authService.user.next(res.response);
      // @ts-ignore
        this.companiesService.companyMessages.next(res.savedCompanyMessages);
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  donateUserAdd(sum: number, idCompany: string) {
    const params = new HttpParams()
      .append("id", idCompany);
    const subscription = this.http.post<User>("/api/user/donate", {
      sum
    }, {
      params
    }).subscribe(res => {
      if (this.authService.user.getValue().permission !== 2) {
        this.authService.user.next(res);
      }
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  addBonuse(idBonuse: string, idCompany: string) {
    const subscription = this.http.post<User>("/api/user/bonuses", {
      idCompany,
      idBonuse
    }).subscribe(res => {
      if (this.authService.user.getValue().permission !== 2) {
        this.authService.user.next(res);
      }
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  getUserBonuses(bonusesArr) {
    return this.http.post<Bonuse[]>("/api/user/bonuses/get", bonusesArr);
  }

  changePermission(permission: number, id: string) {
    const subscription = this.http.post<User>("/api/users/permission", {
      permission,
      id
    }).subscribe(res => {
      this.users.next(this.users.getValue().map(user => {
        if (user.id === res.id) {
          user = res;
        }
        return user;
      }));
      if (this.authService.user.getValue().id === res.id) {
        this.authService.user.next(res);
      }
    }, error => console.log(error), () => subscription.unsubscribe());
  }

  public getUsers() {
    const subscription = this.http.get<User[]>("/api/users").subscribe(res => {
      this.users.next(res);
    }, error => console.log(error), () => subscription.unsubscribe());
  }

  deleteUser(id: string) {
    const params = new HttpParams().append("id", id);
    const subscription = this.http.delete<User>("/api/users", {
      params
    }).subscribe(res => {
      this.users.next(this.users.getValue().filter(user => {
        if (user.id !== res.id) {
          return user;
        }
      }));
    }, error => console.log(error), () => subscription.unsubscribe());
  }

  blockUser(id: string, blocked: boolean) {
    const subscription = this.http.post<User>("/api/users/block", {
      id,
      blocked
    }).subscribe(res => {
      this.users.next(this.users.getValue().map(user => {
        if (user.id === res.id) {
          user = res;
        }
        return user;
      }));
    }, error => console.log(error), () => subscription.unsubscribe());
  }
}
