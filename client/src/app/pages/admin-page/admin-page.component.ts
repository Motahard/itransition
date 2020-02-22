import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.class";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs";

@Component({
  selector: "app-admin-page",
  templateUrl: "./admin-page.component.html",
  styleUrls: ["./admin-page.component.scss"]
})
export class AdminPageComponent implements OnInit {
  user: User;
  users: User[];
  usersSub$: Subscription;

  constructor(private authService: AuthService, private router: Router, private userService: UserService) {
    this.usersSub$ = this.userService.users.subscribe(users => {
      this.users = users;
    });
    authService.getUserAdmin()
      .then(res => {
        this.user = res;
        return res;
      })
      .then(user => {
        if (!user || user.permission !== 2) {
          this.router.navigate(["/404"]);
        } else {
          this.userService.getUsers();
        }
      })
      .catch(error => console.log(error.message));
  }

  ngOnInit() {
  }

  onPermissionClick(permission: number, id: string) {
    this.userService.changePermission(permission, id);
  }

  onDeleteClick(id: string) {
    this.userService.deleteUser(id);
  }

  onBlockClick(id: string, blocked: boolean) {
    this.userService.blockUser(id, blocked);
  }
}
