import { Component, OnInit } from '@angular/core';
import { HomeService } from '../shared/home.service';
import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/category.model';
import { Product } from '../shared/product.Model';
import { ProductService } from '../shared/product.service';
import { Router } from '@angular/router';
import { User } from '../shared/user.model';
import decode from 'jwt-decode';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.scss']
})
export class HomeLayoutComponent implements OnInit {
  categories:Category[];
  products:any[];

  constructor(
    public homeService:HomeService,
    private categoryService:CategoryService,
    private productService:ProductService,
    private router:Router,
    private authService:AuthService,
    ) { }

  ngOnInit(): void {
    const token=localStorage.getItem('token');
    if (token){
      const tokenPayload = decode(token);
      let id=tokenPayload.user_id;
      this.authService.user_info(id).subscribe((data:any) => {
        this.homeService.loggedUser=data as User;
      })
    }
    this.getCategories();
    this.getProducts();
    this.homeService.countProduct();


  }

  getCategories(){
    this.categoryService.getCategories().then(res=>{
      this.categories=res as Category[];
    })
  }

  getProducts(){
    this.productService.getProducts().then(res=>{
      this.products = res as Product[];
    })
  }



  filterProductsByCategoryOrSubCategory(id:number,isCategory:boolean){
    if(isCategory){
      this.homeService.homeProducts=this.products.filter(x=>x.category===id);
      this.router.navigateByUrl('', { state:{data: {id:id,isCategory:isCategory,all:false}} });
    }else{
      this.homeService.homeProducts=this.products.filter(x=>x.subCategory===id);
      this.router.navigateByUrl('', { state:{data: {id:id,isCategory:isCategory,all:false}} });
    }
  }

  searchProduct(name){
    this.homeService.homeProducts=this.products.filter(
      x=>x.name.toLowerCase().includes(name.toLowerCase()) || 
      x.categoryName.toLowerCase().includes(name.toLowerCase()) ||
      x.brandName.toLowerCase().includes(name.toLowerCase()) ||
      x.subCategoryName.toLowerCase().includes(name.toLowerCase()) 
    );
  }

  goToHome(){
    this.homeService.homeProducts=this.products;
    this.router.navigate(['']);
  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('rtoken');
    this.homeService.loggedUser=new User();
    this.router.navigate(['']);
  }

 

}
