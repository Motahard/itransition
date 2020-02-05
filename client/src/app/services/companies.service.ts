import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Company } from "../models/company.class";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class CompaniesService {
  companies: BehaviorSubject<Company[]>;

  constructor(private http: HttpClient) {
    this.companies = new BehaviorSubject<Company[]>([]);
  }

  createCompany(company: Company): void {
    this.http.post("/api/companies/add", company).subscribe(res => {
      console.log(res);
    });
  }

  getCompanies(): void {
    // this.http.get<Company[]>("/api/companies").subscribe(companies => {
    //   this.companies.next(companies);
    // });
  }
}
