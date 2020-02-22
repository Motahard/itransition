import {Component, OnDestroy, OnInit} from "@angular/core";
import { CompaniesService } from "src/app/services/companies.service";
import { Company } from "src/app/models/company.class";
import {FormGroup, FormControl, Validators, FormArray} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {User} from "../../models/user.class";
import {ActivatedRoute, Router} from "@angular/router";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {finalize} from "rxjs/operators";
import {AngularFireStorage} from "@angular/fire/storage";

@Component({
  selector: "app-create-company-page",
  templateUrl: "./create-company-page.component.html",
  styleUrls: ["./create-company-page.component.scss"]
})
export class CreateCompanyPageComponent implements OnInit, OnDestroy {
  form: any;
  company: Company;
  userSub$: Subscription;
  user: User;
  id: string;
  currentDate: Date;
  files: NgxFileDropEntry[] = [];
  loadingImage: boolean;
  droppedFile: boolean;
  downloadURL: string[] = [];
  imagePaths: string[] = [];
  imagePath: string;
  tags: string[] = [];
  tags$: Subscription;
  tagsToDisplay: Set<string> = new Set();

  constructor(private companiesService: CompaniesService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private router: Router,
              private storage: AngularFireStorage) {
    this.tags$ = this.companiesService.getTags().subscribe(res => {
      this.tags = res;
    });
    this.currentDate = new Date();
    this.currentDate.setDate(this.currentDate.getDate() + 1);
    this.userSub$ = this.authService.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    this.id = route.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    if (!this.user) {
      this.router.navigate(["/login"]);
    }
    this.form = new FormGroup({
      title: new FormControl("", [
        Validators.required,
        Validators.minLength(2)
      ]),
      description: new FormControl("", [
        Validators.required,
        Validators.minLength(64)
      ]),
      category: new FormControl("Services", Validators.required),
      tags: new FormControl(""),
      amount: new FormControl("", Validators.required),
      dateEnd: new FormControl("", Validators.required),
      yLink: new FormControl(""),
      bonuses: new FormArray([]),
    });
  }

  onKeydown(e) {
    const tagArr = e.target.value.split(" ").join("").split(",");
    const lastItem = tagArr[tagArr.length - 1];
    if (lastItem.length === 0) {
      this.tagsToDisplay.clear();
    } else {
      this.tags.forEach(tag => tag.includes(lastItem) ? this.tagsToDisplay.add(tag) : this.tagsToDisplay.delete(tag));
    }
  }

  onTagClick(tag) {
    const tagArr = this.form.get("tags").value.split(" ").join("").split(",");
    tagArr[tagArr.length - 1] = tag;
    this.form.get("tags").value = tagArr.join(",");
    // @ts-ignore
    document.getElementById("tags").value = tagArr.join(",");
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

  generateBonuse() {
    return new FormGroup({
      name: new FormControl("", Validators.required),
      price: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required)
    });
  }

  removeBonuse(i: number) {
    this.form.get("bonuses").removeAt(i);
  }

  get getBonuseControls() {
    return this.form.get("bonuses").controls;
  }

  addBonuse() {
    this.form.get("bonuses").push(this.generateBonuse());
  }

  onSubmit() {
    const formData = { ...this.form.value };
    const yLink = formData.yLink;
    const tagsArr = formData.tags.trim().split(",");
    let slicedLink;
    let gallery = [];

    if (yLink) {
      slicedLink = yLink.slice(yLink.indexOf("=") + 1);
    }

    if (this.droppedFile) {
      gallery = this.imagePaths.map((path, i) => {
        const url = this.downloadURL[i];
        return {path, url};
      });
    }

    this.company = {
      owner: this.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: tagsArr,
      amount: +formData.amount,
      dateStart: Date.now(),
      dateEnd: new Date(formData.dateEnd).getTime(),
      currentAmount: 0,
      youtubeLink: slicedLink,
      bonuses: formData.bonuses,
      gallery
    };
    this.companiesService.createCompany(this.company);
    this.form.reset();
    this.router.navigate(["/"]);
  }

  ngOnDestroy(): void {
    this.userSub$.unsubscribe();
    this.tags$.unsubscribe();
  }
}
