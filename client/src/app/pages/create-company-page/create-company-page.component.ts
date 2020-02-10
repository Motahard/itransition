import {Component, OnDestroy, OnInit} from "@angular/core";
import { CompaniesService } from "src/app/services/companies.service";
import { Company } from "src/app/models/company.class";
import {FormGroup, FormControl, Validators, FormArray} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Subscription} from "rxjs";
import {User} from "../../models/user.class";
import {Router} from "@angular/router";

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

  constructor(private companiesService: CompaniesService, private authService: AuthService, private router: Router) {
    this.userSub$ = this.authService.user.subscribe(user => {
      if (user) {
        this.user = user;
        this.id = user.id;
      }
    });
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
      category: new FormControl("services", Validators.required),
      tags: new FormControl(""),
      amount: new FormControl("", Validators.required),
      dateEnd: new FormControl("", Validators.required),
      yLink: new FormControl(""),
      bonuses: new FormArray([]),
    });
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
    let slicedLink;

    if (yLink) {
      slicedLink = yLink.slice(yLink.indexOf("=") + 1);
    }
    if (!this.id) {

    }

    this.company = {
      owner: this.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: formData.tags,
      amount: +formData.amount,
      dateStart: Date.now(),
      dateEnd: new Date(formData.dateEnd).getTime(),
      currentAmount: 0,
      youtubeLink: slicedLink,
      bonuses: formData.bonuses
    };

    this.companiesService.createCompany(this.company);
    this.form.reset();
  }

  ngOnDestroy(): void {
    this.userSub$.unsubscribe();
  }
}
