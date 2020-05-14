import { Injectable } from '@angular/core';
import { Product } from './product.Model';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  homeProducts:Product[];
  cart:any[]=[];
  totalProduct:number=0;
  loggedUser:User=new User();
  
  constructor() { }

  countProduct(){
    this.cart=localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[];
    this.totalProduct=0;
    for(let c of this.cart){
      this.totalProduct+=c.quantity;
    }
  }
}
