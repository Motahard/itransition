import { Injectable } from "@angular/core";
import {BehaviorSubject } from "rxjs";
import {Company, CompanyMessage} from "../models/company.class";
import { HttpClient, HttpParams } from "@angular/common/http";
import {WebSocketSubject} from "rxjs/internal-compatibility";

@Injectable({
  providedIn: "root"
})
export class CompaniesService {
  companies: BehaviorSubject<Company[]>;
  company: BehaviorSubject<Company>;
  companyMessages: BehaviorSubject<CompanyMessage[]>;
  socket$: WebSocketSubject<CompanyMessage>;

  constructor(private http: HttpClient) {
    this.companies = new BehaviorSubject<Company[]>([]);
    this.company = new BehaviorSubject<Company>(null);
    this.companyMessages = new BehaviorSubject<CompanyMessage[]>([]);
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
    return ((company.currentAmount / company.amount) * 100).toFixed().toString() + "%";
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
}
