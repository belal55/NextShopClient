import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NgForm } from '@angular/forms';
import { OrderService } from '../shared/order.service';
import { HomeService } from '../shared/home.service';
import { Order } from '../shared/order.model';
import { Router } from '@angular/router';
import decode from 'jwt-decode';
import { User } from '../shared/user.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart:any[]=[];
  subTotal:number;
  orderTotal:number;
  isUserExist={
    id:null,
    address:'',
    addressId:null
  };
  formData={
    email:'',
    first_name:'',
    last_name:'',
    mobile:'',
    address:''
  }

  constructor(
    private authService:AuthService,
    private orderService:OrderService,
    private homeService:HomeService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.cart=localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[];
    this.loadSummery();
    if(this.homeService.loggedUser){
      this.formData.email=this.homeService.loggedUser.email;
      this.formData.first_name=this.homeService.loggedUser.first_name;
      this.formData.first_name=this.homeService.loggedUser.last_name;
      this.check_email(this.homeService.loggedUser.email);
    }
  }

  loadSummery(){
    this.subTotal=0;
    this.orderTotal=0;
    for(let c of this.cart){
      this.subTotal+=c.amount;
    }
    this.orderTotal=this.subTotal+0+60;

  }

  check_email(email:string){
    console.log(email);
    this.authService.check_email(email).then(res=>{
      this.isUserExist=res as any;
      if(this.isUserExist.id!=null && this.isUserExist.addressId !=null){
        this.formData.address=this.isUserExist.address;
      }
    })
  }

  onSubmit(form:NgForm){
    if(form.valid){
        var obj;
        if(this.isUserExist.id && this.isUserExist.addressId && this.isUserExist.address===this.formData.address){
          obj={
            id:null,
            user:this.isUserExist.id,
            address:this.isUserExist.addressId,
            status:"PENDING",
            orderitem_set:this.cart
          }
        }else if(this.isUserExist.id && (!this.isUserExist.addressId || this.isUserExist.address!==this.formData.address)){
          obj={
            id:null,
            user:this.isUserExist.id,
            newAddress:this.formData.address,
            status:"PENDING",
            orderitem_set:this.cart
          }
        }else if(!this.isUserExist.id && !this.isUserExist.addressId){
          obj={
            id:null,
            user:null,
            newEmail:this.formData.email,
            newAddress:this.formData.address,
            status:"PENDING",
            orderitem_set:this.cart
          }
        }

        this.orderService.saveOrUpdatOrders(obj).then(res=>{
            this.cart=[];
            localStorage.removeItem('cart')
            this.homeService.countProduct();
            this.loadSummery();
            form.reset();
            let newOrder=res as Order;
            if(!localStorage.getItem('token')){
              this.authService.menual_token(newOrder.transactionId).subscribe((data:any) => {     
                localStorage.setItem('token', data.access);
                localStorage.setItem('rtoken', data.refresh);

                const tokenPayload = decode(data.access);
                let id=tokenPayload.user_id;
                this.authService.user_info(id).subscribe((data:any) => {
                  this.homeService.loggedUser=data as User;
                  this.router.navigateByUrl('/dashboard',{state:{newUser:true}}) 
                })
                       
              },err=>{
                alert(err.error.detail);
              });
            }else{
              this.router.navigateByUrl('/dashboard',{state:{newUser:false}}) 
            }

        },errr=>{
          alert(errr.error);
        })
    }
    
  }

}
