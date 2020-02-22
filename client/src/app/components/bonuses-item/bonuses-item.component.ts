import {Component, Input, OnInit} from "@angular/core";
import {Bonuse, Company} from "../../models/company.class";
import {User} from "../../models/user.class";
import {CompaniesService} from "../../services/companies.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: "app-bonuses-item",
  templateUrl: "./bonuses-item.component.html",
  styleUrls: ["./bonuses-item.component.scss"]
})
export class BonusesItemComponent implements OnInit {
  @Input() bonuse: Bonuse;
  @Input() id: string;
  @Input() company: Company;
  @Input() user: User;
  canCreate: boolean;
  onEdit: boolean;
  onDelete: boolean;
  form: FormGroup;

  constructor(private companiesService: CompaniesService) {
  }

  ngOnInit() {
    if (this.user) {
      if (this.user.id === this.company.owner || this.user.permission === 2) {
        this.canCreate = true;
        this.form = new FormGroup({
          title: new FormControl(this.bonuse.name, [Validators.required, Validators.minLength(2)]),
          description: new FormControl(this.bonuse.description, [Validators.required, Validators.minLength(2)]),
          price: new FormControl(this.bonuse.price, Validators.required)
        });
      }
    }
  }
  public onSaveBonuse() {
    const formData = {...this.form.value};
    const bonuse: Bonuse = {
      _id: this.bonuse._id,
      name: formData.title,
      description: formData.description,
      price: +formData.price
    };

    this.companiesService.updateBonuse(this.id, bonuse);
    this.onEdit = false;
  }
  public onDeleteBonuse() {
    this.companiesService.deleteBonuse(this.id, this.bonuse._id);
    this.onDelete = false;
  }
}
