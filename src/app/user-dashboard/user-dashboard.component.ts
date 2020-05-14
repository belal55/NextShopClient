import { Component, OnInit } from '@angular/core';
import { User } from '../shared/user.model';
import decode from 'jwt-decode';
import { AuthService } from '../auth/auth.service';
import { HomeService } from '../shared/home.service';
import { NgForm } from '@angular/forms';
import { Order } from '../shared/order.model';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
   user:User;
   orders:Order[];
   isNewUser:boolean;
   formData={
     'password':'',
     'confirmPassword':''
   }

  constructor(
    public homeService:HomeService,
    private authService:AuthService,
    private userService:UserService
    ) {}

  ngOnInit(): void {
      this.isNewUser=history.state.newUser;

      const token=localStorage.getItem('token');
      if (token){
        const tokenPayload = decode(token);
        let id=tokenPayload.user_id;
        this.authService.user_info(id).subscribe((data:any) => {
          this.user=data as User;
          this.order_by_user();
        })
      }
      

      
  }

  onSubmitPasswordConfigureForm(form:NgForm){
    
    if(form.valid){
      this.formData['email']=this.homeService.loggedUser.email;
      this.authService.configure_pass(this.formData).then(res=>{
        form.reset();
        this.isNewUser=false;

      },err=>{
        alert(err)
      })
    }

  }

  clearPasswordConfigureForm(form:NgForm){
    form.reset();
  }

  order_by_user(){
    const id=this.user.id;
    this.userService.order_by_user(id).then(res=>{
      this.orders=res as Order[];
      console.log(this.orders);
    },err=>{
      alert(err.error);
    })
  }


}
