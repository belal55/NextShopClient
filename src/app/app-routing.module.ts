import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CategoryComponent} from './category/category.component'
import {SubCategoryComponent} from './sub-category/sub-category.component'
import {BrandComponent} from './brand/brand.component'
import {ProductComponent} from './product/product.component'
import {AdminLayoutComponent} from './admin-layout/admin-layout.component'
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component'
import {OrderComponent} from './order/order.component'
import { LoginComponent } from './login/login.component';
import {AuthGuardService as AuthGuard} from './auth/auth-guard.service'
import { RoleGuardServiceService as RoleGuard } from './auth/role-guard-service.service';
import { HomeComponent } from './home/home.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { ProductDetialsComponent } from './product-detials/product-detials.component';
import { CartComponent } from './cart/cart.component';
import { RegisterComponent } from './register/register.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
      path: 'admin',
      component: AdminLayoutComponent,
      canActivate: [RoleGuard],
      data: { 
        expectedRole: 'Admin'
      },
      children: [
        { path: '', component: AdminDashboardComponent},
        { path: 'category', component: CategoryComponent },
        { path: 'subCategory', component: SubCategoryComponent },
        { path: 'brand', component: BrandComponent },
        { path: 'product', component: ProductComponent },
        { path: 'order', component: OrderComponent },
        { path: 'user', component: UserComponent },
      ]
  },

  {path:'',
    component:HomeLayoutComponent,
    children:[
      { path: '', component: HomeComponent},
      { path: 'productDetails', component: ProductDetialsComponent},
      { path: 'cart', component: CartComponent},
      { path: 'checkout', component: CheckoutComponent},
      { path: 'dashboard', component: UserDashboardComponent,canActivate: [RoleGuard],data:{expectedRole: 'Customer'}},
    ]
  },


  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'**',redirectTo:'',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
