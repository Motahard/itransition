import {Component, Input} from "@angular/core";
import {CompaniesService} from "../../services/companies.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent {
  @Input() str: string;

  constructor() {

  }



}
