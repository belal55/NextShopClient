import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/product.Model';
import { HomeService } from '../shared/home.service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-product-detials',
  templateUrl: './product-detials.component.html',
  styleUrls: ['./product-detials.component.scss']
})
export class ProductDetialsComponent implements OnInit {
  product:any;
  quantity:number=1;

  constructor(private homeService:HomeService,private router:Router) {
    
  }

  ngOnInit(): void {
    this.product=history.state;
    
  }

  changeQuantity(qty:number,flag:boolean){
    if(flag)
      this.quantity+=qty;
    else{
      if(this.quantity>0){
        this.quantity-=qty;
      }
    }

  }

  addToCart(p:Product){
      var obj={
        id:null,
        product:p.id,
        quantity:this.quantity,
        amount:this.quantity*p.price,

      }
      let found=false;
      if(this.homeService.cart.length>0){

        for(let c of this.homeService.cart){
          if(c.product===obj.product){
            c.quantity+=obj.quantity;
            found=true;
            break;
          }
        }

        if(found==false){
          this.homeService.cart.push(obj);
        }

      }else{
        this.homeService.cart.push(obj);
      }

      this.quantity=1;
      localStorage.setItem("cart",JSON.stringify(this.homeService.cart));
      this.homeService.countProduct();
      console.log(localStorage.getItem("cart"));
  }


  continueShopping(){
    this.router.navigate(['']);
  }




}
