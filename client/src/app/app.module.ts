import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { RegistrationPageComponent } from "./pages/registration-page/registration-page.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { MainPageComponent } from "./pages/main-page/main-page.component";
import { TokenInterceptor } from "./interceptors/token";
import { CompaniesComponent } from "./components/companies/companies.component";
import { AddCompanyComponent } from "./components/add-company/add-company.component";
import { CreateCompanyPageComponent } from "./pages/create-company-page/create-company-page.component";
import { SearchComponent } from "./components/search/search.component";
import { CompanyItemComponent } from "./components/company-item/company-item.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegistrationPageComponent,
    NavbarComponent,
    MainPageComponent,
    CompaniesComponent,
    AddCompanyComponent,
    CreateCompanyPageComponent,
    SearchComponent,
    CompanyItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
