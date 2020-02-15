import {Component, OnDestroy, OnInit} from "@angular/core";
import {CompaniesService} from "../../services/companies.service";
import {ActivatedRoute} from "@angular/router";
import {User} from "../../models/user.class";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CompanyMessage} from "../../models/company.class";
import {UserService} from "../../services/user.service";

@Component({
  selector: "app-company-comments-page",
  templateUrl: "./company-comments-page.component.html",
  styleUrls: ["./company-comments-page.component.scss"]
})
export class CompanyCommentsPageComponent implements OnInit, OnDestroy {
  idCompany: string;
  companyMessages: CompanyMessage[];
  companyMessagesSub$: Subscription;
  user: User;
  userSub$: Subscription;
  form: FormGroup;

  constructor(private companiesService: CompaniesService,
              private authService: AuthService,
              private userService: UserService,
              private aRoute: ActivatedRoute) {
    this.form = new FormGroup({
      message: new FormControl("", Validators.required)
    });
    this.userSub$ = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.companyMessagesSub$ = this.companiesService.companyMessages.subscribe(cm => {
      this.companyMessages = cm;
    });
  }

  ngOnInit() {
    this.idCompany = this.aRoute.parent.snapshot.paramMap.get("id");
  }

  sendMessage(): void {
    if (!this.user) {
      return;
    }
    const message: CompanyMessage = {
      userId: this.user.id,
      username: this.user.name,
      message: this.form.value.message,
      date: Date.now(),
      likes: 0
    };
    this.companiesService.addCompanyMessage(this.idCompany, message);
    this.form.reset();
  }

  onLikeClick(commentId) {
    if (!this.user) {
      return;
    }
    this.userService.commentLikeUser(commentId, this.idCompany);
  }

  ngOnDestroy(): void {
    this.companyMessagesSub$.unsubscribe();
    this.userSub$.unsubscribe();
  }

}
