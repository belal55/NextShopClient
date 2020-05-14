import { Component, OnInit,ViewChild } from '@angular/core';
import {Category} from '../shared/category.model'
import {SubCategory} from '../shared/sub-category.model'
import {CategoryService} from '../shared/category.service'
import {SubCategoryService} from '../shared/sub-category.service'
import { NgForm } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {
  categories:Category[];
  subCategories:SubCategory[];
  formData:SubCategory;
  displayedColumns: string[] = ['id', 'name', 'categoryName','actions'];
  dataSource: MatTableDataSource<SubCategory>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private categoryService:CategoryService,
    private subCategoryService:SubCategoryService,

  ) { }

  ngOnInit(): void {
    this.getSubCategories();
    this.getCategories();
    this.loadSubCategory(new SubCategory());
  }

  loadSubCategory(subCat:SubCategory){
    this.formData=Object.assign({}, subCat);
  }

  getCategories(){
    this.categoryService.getCategories().then(res=>{
        this.categories=res as Category[];
    },err=>{
        alert(err)
    })
  }

  getSubCategories(){
    this.subCategoryService.getSubCategories().then(res=>{
        this.subCategories=res as SubCategory[];
        this.dataSource = new MatTableDataSource<SubCategory>(this.subCategories);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    },err=>{
        alert(err)
    })
  }

  deletegetSubCategories(id){
    this.subCategoryService.deletegetSubCategories(id).then(res=>{
      this.getSubCategories();
      alert("Success");

    },err=>{
        alert(err)
    })
  }

  onSubmit(form:NgForm){
    if(form.valid){
      this.subCategoryService.saveOrUpdategetSubCategories(form.value).then(res=>{
        form.resetForm();
        this.getSubCategories();
      },err=>{
        alert("Something went wrong!!");
      })
    }else{
      alert("Invalid info");
      form.resetForm();
    }
  }

  clearForm(form:NgForm){
    form.resetForm();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
