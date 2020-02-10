import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {Company} from "../../models/company.class";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../models/user.class";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";

@Component({
  selector: "app-profile-page",
  templateUrl: "./profile-page.component.html",
  styleUrls: ["./profile-page.component.scss"]
})
export class ProfilePageComponent implements OnInit, OnDestroy {
  userIdRoute: string;
  form: any;
  user: User;
  companies: Company[] = [];
  userSub$: Subscription;
  companiesSub$: Subscription;

  constructor(private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.userIdRoute = this.activatedRoute.snapshot.paramMap.get("id");
    this.userSub$ = authService.user.subscribe(user => {
      this.user = user;
      this.userService.getUserCompanies();
    });
    this.companiesSub$ = this.userService.userCompanies.subscribe(companies => {
      this.companies = companies;
    });
  }

  ngOnInit() {
    if (!this.user || this.user.id !== this.userIdRoute) {
       this.router.navigate(["/login"]);
       return;
    }
    this.form = new FormGroup({
      email: new FormControl(this.user.email, [Validators.required, Validators.email]),
      name: new FormControl(this.user.name, [Validators.required, Validators.minLength(2)]),
      theme: new FormControl("light", Validators.required),
      language: new FormControl("eng", Validators.required)
    });
  }

  createUserCompany() {
    this.router.navigate([`/create-company/${this.userIdRoute}`]);
  }

  onUpdate(): void {
    const formData = { ...this.form.value, id: this.userIdRoute};
    this.userService.updateUserData(formData);
  }

  onDelete(id): void {
    this.userService.deleteUserCompany(id);
  }

  ngOnDestroy(): void {
    this.userSub$.unsubscribe();
    this.companiesSub$.unsubscribe();
  }
}
