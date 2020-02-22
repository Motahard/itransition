import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import { CompaniesService } from "src/app/services/companies.service";
import { Subscription } from "rxjs";
import { Company } from "src/app/models/company.class";
import {User} from "../../models/user.class";
import {AuthService} from "../../services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {finalize} from "rxjs/operators";
import {AngularFireStorage} from "@angular/fire/storage";
import "firebase/storage";
import {MarkdownService} from "ngx-markdown";

@Component({
  selector: "app-company-page",
  templateUrl: "./company-page.component.html",
  styleUrls: ["./company-page.component.scss"]
})
export class CompanyPageComponent implements OnInit, OnDestroy {
  id: string;
  private companySub$: Subscription;
  private userSub$: Subscription;
  form: FormGroup;
  companyForm: FormGroup;
  user: User;
  userLikeRate: number;
  company: Company;
  daysRemain: number;
  amount: string;
  showNews: boolean;
  showComments: boolean;
  addingBonuse: boolean;
  canCreate: boolean;
  editCompany: boolean;
  currentDate: number = Date.now();
  files: NgxFileDropEntry[] = [];
  loadingImage: boolean;
  droppedFile: boolean;
  downloadURL: string[] = [];
  imagePaths: string[] = [];
  imagePath: string;
  deletingImg: boolean;
  description: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private companiesService: CompaniesService,
    private authService: AuthService,
    private storage: AngularFireStorage,
    private markdown: MarkdownService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
    this.companiesService.getCompany(this.id);
    const show = activatedRoute.snapshot.children[0] ? activatedRoute.snapshot.children[0].url[0].path : undefined;
    if (show && show === "comments") {
      this.showComments = true;
    } else if (show && show === "news") {
      this.showNews = true;
    }
    this.companySub$ = this.companiesService.company.subscribe(company => {
      this.company = company;
      if (company) {
        this.description =  this.markdown.compile(company.description);
        this.amount = this.companiesService.getPercentCompletion(company);
        this.daysRemain = this.companiesService.getRemainTime(company);
        if (this.user) {
          if (this.company.owner === this.user.id || this.user.permission === 2) {
            this.canCreate = true;
          }
        }
        this.companyForm = new FormGroup({
          title: new FormControl(this.company.title, [
            Validators.required,
            Validators.minLength(2)
          ]),
          description: new FormControl(this.company.description, [
            Validators.required,
            Validators.minLength(64)
          ]),
          category: new FormControl(this.company.category, Validators.required),
          tags: new FormControl(this.company.tags.join(", ")),
          amount: new FormControl(this.company.amount, Validators.required),
          dateEnd: new FormControl(this.company.dateEnd, Validators.required),
          yLink: new FormControl(this.company.youtubeLink && "https://www.youtube.com/watch?v=" + this.company.youtubeLink)
        });
      }
    });
    this.userSub$ = this.authService.user.subscribe(user => {
      this.user = user;
      if (this.user) {
        if (this.user.rates) {
          this.user.rates.forEach(rate => {
            if (rate.company === this.id) {
              this.userLikeRate = rate.rate;
            }
          });
        }
      }
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl("", [Validators.required, Validators.minLength(2)]),
      description: new FormControl("", [Validators.required, Validators.minLength(2)]),
      price: new FormControl("", Validators.required)
    });
  }

  onStarClick(event) {
    const rate = event.target.getAttribute("name");
    this.companiesService.addNewRate(rate, this.id, this.user.id);
  }

  onAddBonuse() {
    const formData = this.form.value;
    const bonuse = {
      name: formData.title,
      description: formData.description,
      price: formData.price
    };
    this.companiesService.addCompanyBonuse(this.id, bonuse);
    this.addingBonuse = false;
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        this.loadingImage = true;
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.imagePath = this.companiesService.generatePath(file, "company");
          this.imagePaths.push(this.imagePath);
          const fileRef = this.storage.ref(this.imagePath);
          const task = this.storage.upload(this.imagePath, file);
          const subscription = task.snapshotChanges().pipe(
            finalize(() => {
              const sub = fileRef.getDownloadURL().subscribe(res => this.downloadURL.push(res),
                err => console.log(err),
                () => {
                  this.loadingImage = false;
                  this.droppedFile = true;
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
  onDeleteImg(img) {
    const ref = this.storage.ref(img.path);
    ref.delete();
    this.loadingImage = true;
    this.companiesService.deleteImgFromGallery(this.id, img._id);
    this.loadingImage = false;
  }

  onSubmit() {
    const formData = this.companyForm.value;
    let slicedLink = null;
    if (formData.yLink) {
      slicedLink = formData.yLink.slice(formData.yLink.indexOf("=") + 1);
    }
    let toEditCompany = {};
    if (this.droppedFile) {
      const gallery = this.imagePaths.map((path, i) => {
        const url = this.downloadURL[i];
        return { path, url };
      });

      toEditCompany = {
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(" ").join("").split(","),
        youtubeLink: slicedLink,
        category: formData.category,
        amount: formData.amount,
        dateEnd: new Date(formData.dateEnd).getTime(),
        gallery
      };
    } else {
      toEditCompany = {
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(" ").join("").split(","),
        youtubeLink: slicedLink,
        category: formData.category,
        amount: formData.amount,
        dateEnd: new Date(formData.dateEnd).getTime()
      };
    }
    this.companiesService.updateCompany(this.id, toEditCompany);
    this.editCompany = false;
    this.droppedFile = false;
    this.companyForm.reset();
    this.imagePaths = [];
    this.downloadURL = [];
  }

  ngOnDestroy() {
    this.companiesService.company.next(null);
    this.companySub$.unsubscribe();
    this.userSub$.unsubscribe();
  }
}
