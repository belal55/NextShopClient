import { Component, OnInit,ViewChild } from '@angular/core';
import {Brand} from '../shared/brand.model';
import {BrandService} from '../shared/brand.service';
import {Category} from '../shared/category.model';
import {CategoryService} from '../shared/category.service';
import {SubCategory} from '../shared/sub-category.model';
import {SubCategoryService} from '../shared/sub-category.service';
import {Product} from '../shared/product.Model';
import {ProductService} from '../shared/product.service';
import {NgForm} from '@angular/forms';
import { from } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { isNumber } from 'util';


import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';



declare var $: any;

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  brands:Brand[];
  categories:Category[];
  subCategories:SubCategory[];
  FilteredSubCategories:SubCategory[];
  products:Product[];
  formData:Product;
  files:any[];
  files2:any[] = [];

  displayedColumns: string[] = ['id', 'name','price','stock','categoryName','subCategoryName','brandName','actions'];
  dataSource: MatTableDataSource<Product>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private brandService:BrandService,
    private categoryService:CategoryService,
    private subCategoryService:SubCategoryService,
    private productService:ProductService,

  ) { }

  ngOnInit(): void {

    this.getBrands();
    this.getCategories();
    this.getSubCategories();
    this.getProducts();
    this.loadProduct(new Product(),false);

  }
  loadProduct(pro:Product,showModal:boolean){
    this.FilteredSubCategories=this.subCategories;
    this.formData=Object.assign({}, pro);
    if(showModal)
      $("#myModal").modal('show');
  }
  getBrands(){
    this.brandService.getBrands().then(res=>{
      this.brands=res as Brand[];
    },err=>{
      alert("error occured!")
    })
  }

  getCategories(){
    this.categoryService.getCategories().then(res=>{
      this.categories=res as Category[];
    },err=>{
      alert("error occured!")
    })
  }

  getSubCategories(){
    this.subCategoryService.getSubCategories().then(res=>{
        this.subCategories=res as SubCategory[];
        this.FilteredSubCategories=res as SubCategory[];
    },err=>{
        alert(err)
    })
  }

  getFilteredSubCategories(id){
    this.subCategoryService.getSubCategories().then(res=>{
        this.FilteredSubCategories=this.subCategories.filter(x=>x.category==id);
    },err=>{
        alert(err)
    })
  }

  getProducts(){
    this.productService.getProducts().then(res=>{
        this.products=res as Product[];
        this.dataSource = new MatTableDataSource<Product>(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    },err=>{
        alert(err)
    })
  }

  deleteProducts(id){
    this.productService.deleteProducts(id).then(res=>{
      this.getProducts();
      alert("Success");

    },err=>{
        alert(err)
    })
  }

  onFileChanged(event: any) {
    this.files = event.target.files;
    var reader = new FileReader();
    reader.readAsDataURL(this.files[0]); 
    reader.onload = (_event) => { 
      this.formData.thumbnail = reader.result; 
    }
  }

  onFileChangedChildImg(event: any) {
    this.files2=event.target.files;
    var arr=[];
    for(let f of this.files2){
            // Only process image files.
          if (!f.type.match('image.*')) {
              continue;
          }
  
          var reader = new FileReader();
  
          // Closure to capture the file information.
          reader.onload = (function (theFile) {
              return function (e) {
                  var obj={"id":theFile.name,"image":e.target.result}
                  arr.push(obj)
              };
          })(f);
  
          // Read in the image file as a data URL.
          reader.readAsDataURL(f);

    }
    if(this.formData.productimage_set)
      for(let img of this.formData.productimage_set){
        var obj={"id":img.id,"image":img.image}
        arr.push(obj);
      }
    this.formData.productimage_set=arr;

  }

  onSubmit(form:NgForm){
    if(form.valid){
      const FData = new FormData();
      FData.append('id', isNaN(form.value['id'])==true?'0':form.value['id']);
      FData.append('name', form.value['name']);
      FData.append('price', form.value['price']);
      FData.append('stock', form.value['stock']);
      FData.append('viewCount', '0');
      FData.append('category', form.value['category']);
      FData.append('subCategory', form.value['subCategory']);
      FData.append('brand', form.value['brand']);
      FData.append('description', form.value['description']);
      FData.append('specification', form.value['specification']);
      if(this.files!=null){
        for (const file of this.files) {
          FData.append('thumbnail', file, file.name);
        }
      }

      if(this.files2!=null){
        for(let i=0 ; i < this.files2.length ; i++)
          FData.append('productimage_set[]', this.files2[i],this.files2[i].name);

      }


      this.productService.saveOrUpdateProducts(FData).then(res=>{
        form.resetForm();
        this.hideModal();
        this.getProducts();
        this.files=[];
        this.files2=[];
      },err=>{
        alert("Something went wrong!!");
      })
    }else{
      alert("Invalid info");
      form.resetForm();
    }
  }

  deleteProductImage(id){
    if(isNumber(id)){
      this.productService.deleteProductImage(id).then(res=>{
        this.getProducts();
        alert("deleted");
        this.formData.productimage_set=this.formData.productimage_set.filter(x=>x.id!=id);
  
      },err=>{
        alert("Something went wrong!!");
      })
    }else{
      this.formData.productimage_set=this.formData.productimage_set.filter(x=>x.id!=id);
      var farr:any[] = [];
      for(var i=0;i<this.files2.length;i++){
        if(this.files2[i].name!=id)
          farr.push(this.files2[i]);
      }

      this.files2=farr;

    }
  }

  clearForm(form:NgForm){
    form.resetForm();
    this.files=null;
    this.files2=null;
    this.formData=new Product();
  }

  //for modal 

  showModal(): void {  
    this.formData=Object.assign({}, new Product());
    $("#myModal").modal('show');
  }

  hideModal():void {
    this.files=null;
    this.files2=null;
    if(this.formData.productimage_set)
      this.formData.productimage_set=this.formData.productimage_set.filter(x=>isNumber(x.id));
    $("#myModal").modal('toggle');
  }


  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '500px',
       
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



}
