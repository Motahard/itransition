import { Component, OnInit } from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {CompaniesService} from "../../services/companies.service";
import {User} from "../../models/user.class";
import {Subscription} from "rxjs";
import {Company, CompanyNews} from "../../models/company.class";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: "app-company-news-page",
  templateUrl: "./company-news-page.component.html",
  styleUrls: ["./company-news-page.component.scss"]
})
export class CompanyNewsPageComponent implements OnInit {
  idCompany: string;
  user: User;
  userSub$: Subscription;
  company: Company;
  companySub$: Subscription;
  companyNews: CompanyNews[];
  companyNewsSub$: Subscription;
  canCreate: boolean;
  showForm: boolean;
  form: FormGroup;
  public files: NgxFileDropEntry[] = [];

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private companiesService: CompaniesService,
              private http: HttpClient
  ) {
    this.form = new FormGroup({
      title: new FormControl("", [Validators.required, Validators.minLength(2)]),
      description: new FormControl("", [Validators.required, Validators.minLength(4)])
    });
    this.idCompany = this.route.parent.snapshot.paramMap.get("id");
    this.userSub$ = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.companySub$ = this.companiesService.company.subscribe(company => {
      this.company = company;
    });
    this.companyNewsSub$ = this.companiesService.companyNews.subscribe(cn => {
      this.companyNews = cn;
    });
  }

  ngOnInit() {
   if (this.company.owner === this.user.id) {
     this.canCreate = true;
   }
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(file);
        });
      } else {
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(fileEntry);
      }
    }
  }

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }
}
