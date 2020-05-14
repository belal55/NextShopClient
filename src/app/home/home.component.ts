import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/product.service';
import { Product } from '../shared/product.Model';
import { Router } from '@angular/router';
import { HomeService } from '../shared/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products:Product[]=[];

  constructor(
    private productService:ProductService,
    public homeService:HomeService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.getProducts(history.state);
  }

  

  getProducts(state?:any){
    this.productService.getProducts().then(res=>{
      this.products = res as Product[];
      if(state.data){
        if(state.data.isCategory && !state.data.all){
          this.homeService.homeProducts=this.products.filter(x=>x.category===state.data.id);
        }else if(!state.data.isCategory && !state.data.all){
          this.homeService.homeProducts=this.products.filter(x=>x.subCategory===state.data.id);
        }else{
          this.homeService.homeProducts=this.products
        }
      }else{
        this.homeService.homeProducts=this.products
      }
    })
  }

  goToProductDetails(product:Product){
    this.router.navigateByUrl('/productDetails', { state: product });
  }

}
