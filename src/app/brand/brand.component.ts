import { Component, OnInit,ViewChild } from '@angular/core';
import {Brand} from '../shared/brand.model'
import {BrandService} from '../shared/brand.service'
import { NgForm } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss']
})
export class BrandComponent implements OnInit {
  brands:Brand[];
  formData:Brand;
  displayedColumns: string[] = ['id', 'name','actions'];
  dataSource: MatTableDataSource<Brand>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  constructor(
    private brnadService:BrandService,
  ) { }

  ngOnInit(): void {
    this.getBrands();
    this.loadBrand(new Brand())
  }

  loadBrand(brand:Brand){
    this.formData=Object.assign({}, brand);
  }

  getBrands(){
    this.brnadService.getBrands().then(res=>{
        this.brands=res as Brand[];
        this.dataSource = new MatTableDataSource<Brand>(this.brands);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    },err=>{
        alert(err)
    })
  }

  deleteBrands(id){
    this.brnadService.deleteBrands(id).then(res=>{
      this.getBrands();
      alert("Success");

    },err=>{
        alert(err)
    })
  }

  onSubmit(form:NgForm){
    if(form.valid){
      this.brnadService.saveOrUpdateBrands(form.value).then(res=>{
        form.resetForm();
        this.getBrands();
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
