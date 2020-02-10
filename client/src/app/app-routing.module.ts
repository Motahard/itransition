import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { RegistrationPageComponent } from "./pages/registration-page/registration-page.component";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { CreateCompanyPageComponent } from "./pages/create-company-page/create-company-page.component";
import { CompanyPageComponent } from "./pages/company-page/company-page.component";
import {ProfilePageComponent} from "./pages/profile-page/profile-page.component";
import {NotFoundPageComponent} from "./pages/not-found-page/not-found-page.component";

const routes: Routes = [
  { path: "", component: MainPageComponent },
  { path: "login", component: LoginPageComponent },
  {
    path: "register",
    component: RegistrationPageComponent
  },
  { path: "create-company/:id", component: CreateCompanyPageComponent },
  { path: "company/:id", component: CompanyPageComponent },
  { path: "profile/:id", component: ProfilePageComponent },
  { path: "404", component: NotFoundPageComponent },
  { path: "**", redirectTo: "/404" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
