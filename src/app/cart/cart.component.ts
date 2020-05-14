import { Component, OnInit } from '@angular/core';
import { Product } from '../shared/product.Model';
import { ProductService } from '../shared/product.service';
import { HomeService } from '../shared/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart:any[]=[];
  products:Product[];
  displayProducts:any[];
  subTotal:number;
  orderTotal:number;


  constructor(
    private productService:ProductService,
    private homeService:HomeService,
    private router:Router
    ) { }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct(){
    this.productService.getProducts().then(res=>{
      this.products=res as Product[];
      this.loadDisplayProduct();
    })
  }

  loadDisplayProduct(){
    this.cart=localStorage.getItem("cart")?JSON.parse(localStorage.getItem("cart")):[];
    this.displayProducts=[];
    this.subTotal=0;
    this.orderTotal=0;
    for(let p of this.products){
      let c = this.cart.filter(x=>x.product==p.id);
      if(c.length>0){
        var obj={
          id:c[0].id,
          product:c[0].product,
          name:p.name,
          image:p.thumbnail,
          price:p.price,
          subTotal:c[0].amount,
          quantity:c[0].quantity
        }
        this.displayProducts.push(obj);
        this.subTotal+=c[0].amount;
      }
    }
    this.orderTotal=this.subTotal+0+60;
  }

  changeQuantity(id:number,isIncrease:boolean){
     for(let c of this.cart){
       if(c.product==id){

          if(isIncrease){
            c.amount+=c.amount/c.quantity;
            c.quantity+=1;
          }
          else{
            if(c.quantity>1){
              c.amount-=c.amount/c.quantity;
              c.quantity-=1;
            }
            else{
              this.removeCartItem(c.product);
            }
          }

          break;
       }
     }
    localStorage.setItem('cart',JSON.stringify(this.cart));
    this.homeService.countProduct();
    this.loadDisplayProduct();

  }

  removeCartItem(id:number){
    this.cart=this.cart.filter(x=>x.product!=id)
    localStorage.setItem('cart',JSON.stringify(this.cart));
    this.homeService.countProduct();
    this.loadDisplayProduct();
  }

  continueShopping(){
    this.router.navigate(['']);
  }

  clearCart(){
    let ans="Are you sure??"
    if(window.confirm(ans)){
      localStorage.removeItem('cart');
      this.homeService.countProduct();
      this.loadDisplayProduct();
    }
  }



}
