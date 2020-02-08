import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Company } from "../models/company.class";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CompaniesService {
  companies: BehaviorSubject<Company[]>;
  company: BehaviorSubject<Company>;

  constructor(private http: HttpClient) {
    this.companies = new BehaviorSubject<Company[]>([]);
    this.company = new BehaviorSubject<Company>(null);
  }

  createCompany(company: Company): void {
    this.http.post("/api/companies/add", company).subscribe(res => {
      console.log(res);
    });
  }

  public getRemainTime(company: Company): number {
    return  Math.ceil((company.dateEnd - company.dateStart) / 1000 / 60 / 60 / 24);
  }

  public getPercentCompletion(company: Company): string {
    return ((company.currentAmount / company.amount) * 100).toFixed().toString() + "%";
  }

  getCompany(id) {
    const params = new HttpParams().set("id", id);
    this.http
      .get<Company>(`/api/company`, {
        params
      })
      .subscribe(company => {
        this.company.next(company);
      });
  }

  getCompanies(): void {
    this.http.get<Company[]>("/api/companies").subscribe(companies => {
      this.companies.next(companies);
    });
  }
}
