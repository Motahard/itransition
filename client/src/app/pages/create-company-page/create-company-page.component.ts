import { Component, OnInit } from "@angular/core";
import { CompaniesService } from "src/app/services/companies.service";
import { Company } from "src/app/models/company.class";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-create-company-page",
  templateUrl: "./create-company-page.component.html",
  styleUrls: ["./create-company-page.component.scss"]
})
export class CreateCompanyPageComponent implements OnInit {
  form: FormGroup;
  company: Company;

  constructor(private companiesService: CompaniesService) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl("", [
        Validators.required,
        Validators.minLength(2)
      ]),
      description: new FormControl("", [
        Validators.required,
        Validators.minLength(64)
      ]),
      category: new FormControl("services", [Validators.required]),
      tags: new FormControl(""),
      amount: new FormControl(0, [Validators.required]),
      dateEnd: new FormControl("", Validators.required),
      yLink: new FormControl("")
    });
  }

  onSubmit() {
    const formData = { ...this.form.value };
    const yLink = formData.yLink;
    let slicedLink;

    if (yLink) slicedLink = yLink.slice(yLink.indexOf("=") + 1);

    this.company = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      tags: formData.tags,
      amount: +formData.amount,
      dateStart: Date.now(),
      dateEnd: new Date(formData.dateEnd).getTime(),
      currentAmount: 0,
      youtubeLink: slicedLink
    };

    this.companiesService.createCompany(this.company);
    this.form.reset();
  }
}
