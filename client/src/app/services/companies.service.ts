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

  getCompanies() {
    this.http.get<Company[]>("/api/companies").subscribe(companies => {
      //this.companies.next(companies);
      console.log(companies);
    });
  }
}
