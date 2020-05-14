import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule,HTTP_INTERCEPTORS} from '@angular/common/http';
import { MainInterceptor } from './helper/main.interceptor';
import { ErrorInterceptor } from './helper/error.interceptor';
import {FormsModule} from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table'; 
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon'; 
import {JwtModule} from '@auth0/angular-jwt';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryComponent } from './category/category.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
import { BrandComponent } from './brand/brand.component';
import { ProductComponent } from './product/product.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { OrderComponent } from './order/order.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { ProductDetialsComponent } from './product-detials/product-detials.component';
import { CartComponent } from './cart/cart.component';
import { RegisterComponent } from './register/register.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserComponent } from './user/user.component';

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    SubCategoryComponent,
    BrandComponent,
    ProductComponent,
    AdminDashboardComponent,
    AdminLayoutComponent,
    OrderComponent,
    LoginComponent,
    HomeComponent,
    HomeLayoutComponent,
    ProductDetialsComponent,
    CartComponent,
    RegisterComponent,
    CheckoutComponent,
    UserDashboardComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    AngularEditorModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ["http://localhost:4200"],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: MainInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
