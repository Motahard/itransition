import { Injectable } from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {Bonuse, Company, CompanyMessage, CompanyNews} from "../models/company.class";
import { HttpClient, HttpParams } from "@angular/common/http";
import {WebSocketSubject} from "rxjs/internal-compatibility";
import * as uuid from "uuid/v4";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: "root"
})
export class CompaniesService {
  companies: BehaviorSubject<Company[]>;
  company: BehaviorSubject<Company>;
  companyMessages: BehaviorSubject<CompanyMessage[]>;
  socket$: WebSocketSubject<CompanyMessage>;
  companyNews: BehaviorSubject<CompanyNews[]>;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.companies = new BehaviorSubject<Company[]>([]);
    this.company = new BehaviorSubject<Company>(null);
    this.companyMessages = new BehaviorSubject<CompanyMessage[]>([]);
    this.companyNews = new BehaviorSubject<CompanyNews[]>([]);
    this.socket$ = new WebSocketSubject("ws://localhost:5000/api/company/messages");
    this.socket$.subscribe(message => {
      this.companyMessages.next(this.companyMessages.getValue().concat([message]));
    });
  }

  public createCompany(company: Company): void {
    const subscription = this.http.post("/api/companies/add", company).subscribe(res => {
      console.log(res);
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  public getRemainTime(company: Company): number {
    return  Math.ceil((company.dateEnd - company.dateStart) / 1000 / 60 / 60 / 24);
  }

  public getPercentCompletion(company: Company): string {
    return ((company.currentAmount / company.amount) * 100).toFixed(0).toString() + "%";
  }

  public getCompany(id) {
    const params = new HttpParams().set("id", id);
    const subscription = this.http
      .get<Company>(`/api/company`, {
        params
      })
      .subscribe(company => {
        this.company.next(company);
        this.companyMessages.next(company.comments);
        this.companyNews.next(company.news);
      }, err => {
        console.log(err);
      }, () => subscription.unsubscribe());
  }

  public addCompanyMessage(idCompany, message) {
      const params = new HttpParams().set("idCompany", idCompany);
      const subscription = this.http.post<CompanyMessage>("/api/company/messages", message, {
        params
      }).subscribe(res => {
        this.socket$.next(res);
      }, err => {
        console.log(err);
      }, () => subscription.unsubscribe());
  }

  public getCompanies(): void {
    const subscription = this.http.get<Company[]>("/api/companies").subscribe(companies => {
      this.companies.next(companies);
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  public addCompanyNews(idCompany, news) {
    const params = new HttpParams().set("idCompany", idCompany);
    const subscription = this.http.post<CompanyNews>("/api/company/news", news, {
      params
    }).subscribe(res => {
      this.companyNews.next(this.companyNews.getValue().concat([res]));
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  public deleteNews(idCompany, idNews: string) {
    const params = new HttpParams().append("idNews", idNews).append("idCompany", idCompany);
    const subscription = this.http.delete<CompanyNews>("/api/company/news", {
      params
    }).subscribe(res => {
      this.companyNews.next(this.companyNews.getValue().filter(news => news._id !== idNews));
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  public generatePath(file, folder): string {
    return `${folder}/` + `${uuid()}/` + file.name;
  }

  public updateCompanyNews(idCompany: string, id: string, updatedNews) {
    const params = new HttpParams()
      .append("idCompany", idCompany)
      .append("idNews", id);
    const subscription = this.http.put<CompanyNews>("/api/company/news", updatedNews, {
      params
    }).subscribe(res => {
      const next = this.companyNews.getValue().map(news => {
        if (news._id === res[0]._id) {
          return res[0];
        }
        return news;
      });
      this.companyNews.next(next);
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  public addNewRate(rate: string, companyId: string, userId: string) {
    const params = new HttpParams()
      .append("companyId", companyId)
      .append("userId", userId);
    const subscription = this.http.post("/api/company/rates", {rate}, {
      params
    }).subscribe(res => {
      // @ts-ignore
      this.company.next(res.savedCompany);
      const user = this.authService.user.getValue();
      // @ts-ignore
      user.rates = res.rates;
      this.authService.user.next(user);
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  public updateBonuse(idCompany: string, newBonuse: Bonuse) {
    const params = new HttpParams()
      .append("idCompany", idCompany);
    const subscription = this.http.put<Bonuse[]>("/api/company/bonuses",  newBonuse, {
      params
    }).subscribe(res => {
      this.company.next({...this.company.getValue(), bonuses: res });
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  public addCompanyBonuse(idCompany: string, formData: Bonuse) {
    const params = new HttpParams()
      .append("idCompany", idCompany);
    const subscription = this.http.post<Bonuse[]>("/api/company/bonuses", formData, {
      params
    }).subscribe(res => {
      this.company.next({...this.company.getValue(), bonuses: res });
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  public deleteBonuse(idCompany: string, idBonuse: string) {
    const params = new HttpParams()
      .append("idCompany", idCompany)
      .append("idBonuse", idBonuse);
    const subscription = this.http.delete<Bonuse[]>("/api/company/bonuses",  {
      params
    }).subscribe(res => {
      this.company.next({...this.company.getValue(), bonuses: res });
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  updateCompany(id: string, toEditCompany) {
    const params = new HttpParams()
      .append("id", id);
    const subscription = this.http.put<Company>("/api/company",  toEditCompany, {
      params
    }).subscribe(res => {
      this.company.next(res);
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  deleteImgFromGallery(id, img) {
    const params = new HttpParams()
      .append("id", id)
      .append("img", img);
    const subscription = this.http.delete<Company>("/api/company/gallery", {
      params
    }).subscribe(res => {
      const companies = this.companies.getValue().map(company => {
        if (company._id === res._id) {
          company = res;
        }
        return company;
      });
      this.companies.next(companies);
      this.company.next(res);
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }

  getTags() {
    return this.http.get<string[]>("/api/companies/tags");
  }

  searchingCompanies(str: string) {
    const params = new HttpParams()
      .append("str", str)
    return this.http.get<Company[]>("/api/companies/search", {
      params
    });
  }

  donateCompanyAdd(sum: number, idCompany: string) {
    const params = new HttpParams()
      .append("id", idCompany);
    const subscription = this.http.post<Company>("/api/company/donate", {
      sum
    }, {
      params
    }).subscribe(res => {
      this.company.next(res);
    }, err => {
      console.log(err);
    }, () => subscription.unsubscribe());
  }
}
