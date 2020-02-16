import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "@angular/fire";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AppRoutingModule } from "./app-routing.module";
import { NgxFileDropModule } from "ngx-file-drop";
import "firebase/storage";
// import { MarkdownModule } from "ngx-markdown";

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
import { AuthService } from "./services/auth.service";
import { CompanyPageComponent } from "./pages/company-page/company-page.component";
import { YoutubePipe } from "./pipes/youtube.pipe";
import { ProfilePageComponent } from "./pages/profile-page/profile-page.component";
import { NotFoundPageComponent } from "./pages/not-found-page/not-found-page.component";
import { DonationPageComponent } from "./pages/donation-page/donation-page.component";
import { CompanyCommentsPageComponent } from "./pages/company-comments-page/company-comments-page.component";
import { CompanyNewsPageComponent } from "./pages/company-news-page/company-news-page.component";
import {environment} from "../environments/environment";
import { NewsItemComponent } from './components/news-item/news-item.component';

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
    CompanyItemComponent,
    CompanyPageComponent,
    YoutubePipe,
    ProfilePageComponent,
    NotFoundPageComponent,
    DonationPageComponent,
    CompanyCommentsPageComponent,
    CompanyNewsPageComponent,
    NewsItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule
    // MarkdownModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
