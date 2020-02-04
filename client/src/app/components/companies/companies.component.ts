import { Component, OnInit } from "@angular/core";
import { Company } from "src/app/models/company.class";
import { CompaniesService } from "src/app/services/companies.service";

@Component({
  selector: "app-companies",
  templateUrl: "./companies.component.html",
  styleUrls: ["./companies.component.scss"]
})
export class CompaniesComponent implements OnInit {
  companies: Company[];

  constructor(private companiesService: CompaniesService) {
    this.companies = [
      {
        id: "1",
        title: "Company 1",
        shortDescription:
          "Is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when",
        description: "",
        amount: 10000,
        currentAmount: 0,
        category: "Food",
        tags: ["#hi", "#hitch"],
        dateStart: Date.now(),
        dateEnd: Date.now() + 10000000
      },
      {
        id: "2",
        title: "Company 2",
        shortDescription:
          "ut also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with d",
        description: "",
        amount: 1200,
        tags: ["#hi", "#hitch"],
        currentAmount: 1000,
        category: "Mother",
        dateStart: Date.now(),
        dateEnd: Date.now() + 1000000
      },
      {
        id: "3",
        title: "Company 3",
        tags: ["#hi", "#hitch"],
        shortDescription:
          " content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web ",
        description: "",
        amount: 3000,
        currentAmount: 1000,
        category: "Father ",
        dateStart: Date.now(),
        dateEnd: Date.now() + 1000000
      }
    ];
  }

  ngOnInit() {
    this.companiesService.getCompanies();
  }
}
