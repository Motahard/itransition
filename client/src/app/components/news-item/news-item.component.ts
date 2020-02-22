import {Component, Input, OnInit} from "@angular/core";
import {CompanyNews} from "../../models/company.class";
import {CompaniesService} from "../../services/companies.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {finalize} from "rxjs/operators";
import "firebase/storage";
import {AngularFireStorage} from "@angular/fire/storage";
import {MarkdownService} from "ngx-markdown";

@Component({
  selector: "app-news-item",
  templateUrl: "./news-item.component.html",
  styleUrls: ["./news-item.component.scss"]
})
export class NewsItemComponent implements OnInit {
  @Input() news: CompanyNews;
  @Input() canCreate: boolean;
  @Input() idCompany: string;
  edit: boolean;
  form: FormGroup;
  loadingImage: boolean;
  downloadURL: string = null;
  imagePath: string = null;
  droppedFile: boolean;
  public files: NgxFileDropEntry[] = [];

  constructor(private companiesService: CompaniesService,
              private markdown: MarkdownService,
              private storage: AngularFireStorage) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(`${this.news.title}`, [Validators.required, Validators.minLength(2)]),
      description: new FormControl(`${this.news.description}`, [Validators.required, Validators.minLength(4)]),
    });
  }

  public onDeleteNews(idNews) {
    this.companiesService.deleteNews(this.idCompany, idNews);
  }

  public onSave() {
    if (this.droppedFile && this.news.img) {
      const ref = this.storage.ref(this.news.img.path);
      ref.delete();
    }
    const formData = this.form.value;
    let img = null;
    let updatedNews = {};
    if (this.droppedFile) {
      img = {
        URL: this.downloadURL,
        path: this.imagePath
      };
      updatedNews = {
        title: formData.title,
        description: formData.description,
        img,
        date: this.news.date
      };
    } else {
      updatedNews = {
        title: formData.title,
        description: formData.description,
        img: this.news.img,
        date: this.news.date
      };
    }
    this.companiesService.updateCompanyNews(this.idCompany, this.news._id, updatedNews);
    this.edit = false;
    this.downloadURL = null;
    this.imagePath = null;
    this.droppedFile = false;
  }

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        this.loadingImage = true;
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.imagePath = this.companiesService.generatePath(file, "news");
          const fileRef = this.storage.ref(this.imagePath);
          const task = this.storage.upload(this.imagePath, file);
          const subscription = task.snapshotChanges().pipe(
            finalize(() => {
              const sub = fileRef.getDownloadURL().subscribe(res => this.downloadURL = res,
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
}
