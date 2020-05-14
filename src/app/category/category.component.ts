import { Component, OnInit,ViewChild } from '@angular/core';
import {Category} from '../shared/category.model'
import {CategoryService} from '../shared/category.service'
import { NgForm } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories:Category[]=[];
  formData:Category;
  displayedColumns: string[] = ['id', 'name','actions'];
  dataSource: MatTableDataSource<Category>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private categoryService:CategoryService,
  ) { }

  ngOnInit(): void {
    this.getCategories();    
    this.loadCategory(new Category());
  }

  loadCategory(cat:Category){
    this.formData=Object.assign({}, cat);
  }

  getCategories(){
    this.categoryService.getCategories().then(res=>{
        this.categories=res as Category[];
        this.dataSource = new MatTableDataSource<Category>(this.categories);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    },err=>{
        alert(err)
    })
  }

  deleteCategories(id){
    this.categoryService.deleteCategories(id).then(res=>{
      this.getCategories();
      alert("Success");

    },err=>{
        alert(err)
    })
  }

  onSubmit(form:NgForm){
    if(form.valid){
      this.categoryService.saveOrUpdateCategories(form.value).then(res=>{
        form.resetForm();
        this.getCategories();
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
