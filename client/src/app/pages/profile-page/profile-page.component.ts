import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {Bonuse, Company} from "../../models/company.class";
import {ActivatedRoute, Router} from "@angular/router";
import {User, UserSettings} from "../../models/user.class";
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
  currentUser: User;
  currentUserSub$: Subscription;
  companies: Company[] = [];
  userSub$: Subscription;
  companiesSub$: Subscription;
  bonuses: Bonuse[];
  canCreate: boolean;
  settings: UserSettings;

  constructor(private userService: UserService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
    this.settings = this.userService.getUserSettingsInLocalStorage() || {
      theme: "light",
      language: "eng"
    };
    this.userIdRoute = this.activatedRoute.snapshot.paramMap.get("id");
    this.currentUserSub$ = authService.user.subscribe(user => {
      this.currentUser = user;
      if (this.currentUser) {
        if (this.currentUser.id === this.userIdRoute || this.currentUser.permission === 2) {
          this.canCreate = true;
        }
      }
    });
    this.userSub$ = authService.getUserById(this.userIdRoute).subscribe(user => {
      this.user = user;
      this.userService.getUserCompanies(this.user.id);
      if (this.user && this.user.bonuses && this.user.bonuses.length > 0) {
        const subscription = this.userService.getUserBonuses(this.user.bonuses).subscribe(res => {
          this.bonuses = res;
        }, error => {console.log(error); }, () => subscription.unsubscribe());
      }
      this.form = new FormGroup({
        email: new FormControl(this.user.email, [Validators.required, Validators.email]),
        name: new FormControl(this.user.name, [Validators.required, Validators.minLength(2)]),
        theme: new FormControl(this.settings.theme, Validators.required),
        language: new FormControl(this.settings.language, Validators.required)
      });
    });
    this.companiesSub$ = this.userService.userCompanies.subscribe(companies => {
      this.companies = companies;
    });
  }

  ngOnInit() {
  }

  createUserCompany() {
    this.router.navigate([`/create-company/${this.userIdRoute}`]);
  }

  onUpdate(): void {
    const formData = { ...this.form.value, id: this.userIdRoute};
    this.userService.updateUserData(formData, this.user.id);
  }

  onDelete(id): void {
    this.userService.deleteUserCompany(id);
    this.companies = this.companies.filter(company => company._id !== id);
  }

  ngOnDestroy(): void {
    this.userSub$.unsubscribe();
    this.companiesSub$.unsubscribe();
  }
}
