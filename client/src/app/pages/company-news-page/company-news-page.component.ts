import {Component, OnDestroy, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AngularFireStorage} from "@angular/fire/storage";
import "firebase/storage";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {AuthService} from "../../services/auth.service";
import {CompaniesService} from "../../services/companies.service";
import {User} from "../../models/user.class";
import {Subscription} from "rxjs";
import {Company, CompanyNews} from "../../models/company.class";
import {finalize} from "rxjs/operators";

@Component({
  selector: "app-company-news-page",
  templateUrl: "./company-news-page.component.html",
  styleUrls: ["./company-news-page.component.scss"]
})
export class CompanyNewsPageComponent implements OnInit, OnDestroy {
  downloadURL: string;
  imagePath: string;
  idCompany: string;
  user: User;
  userSub$: Subscription;
  company: Company;
  companySub$: Subscription;
  companyNews: CompanyNews[];
  companyNewsSub$: Subscription;
  canCreate: boolean;
  showForm: boolean;
  loadingImage: boolean;
  form: FormGroup;
  public files: NgxFileDropEntry[] = [];

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private companiesService: CompaniesService,
              private storage: AngularFireStorage
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
        this.loadingImage = true;
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.imagePath = this.companiesService.generatePath(file);
          const fileRef = this.storage.ref(this.imagePath);
          const task = this.storage.upload(this.imagePath, file);
          const subscription = task.snapshotChanges().pipe(
            finalize(() => {
              const sub = fileRef.getDownloadURL().subscribe(res => this.downloadURL = res,
                  err => console.log(err),
                () => {
                  this.loadingImage = false;
                  sub.unsubscribe();
                });
        })
          ).subscribe(res => {},
              err => console.log(err),
            () => subscription.unsubscribe());
        });
      }
    }
  }

  public onSubmit() {
    const formData = this.form.value;
    const news: CompanyNews = {
      title: formData.title,
      description: formData.description,
      date: Date.now(),
      img: {
        URL: this.downloadURL,
        path: this.imagePath
      }
      };
    this.companiesService.addCompanyNews(this.idCompany, news);
    this.form.reset();
    this.downloadURL = null;
    this.showForm = false;
  }

  ngOnDestroy(): void {
    this.userSub$.unsubscribe();
    this.companySub$.unsubscribe();
    this.companyNewsSub$.unsubscribe();
  }
}
