import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { RegistrationPageComponent } from "./pages/registration-page/registration-page.component";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { CreateCompanyPageComponent } from "./pages/create-company-page/create-company-page.component";
import { CompanyPageComponent } from "./pages/company-page/company-page.component";

const routes: Routes = [
  { path: "", component: MainPageComponent },
  { path: "login", component: LoginPageComponent },
  {
    path: "register",
    component: RegistrationPageComponent
  },
  { path: "create-company", component: CreateCompanyPageComponent },
  { path: "company/:id", component: CompanyPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
