import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {SubCategory} from './sub-category.model'

@Injectable({
  providedIn: 'root'
})
export class SubCategoryService {

  constructor(private http:HttpClient) { }

  getSubCategories(){
    return this.http.get(environment.apiURL+'/subcategories/').toPromise();
  }

  saveOrUpdategetSubCategories(subCategory:SubCategory){
    if(subCategory.id>0)
      return this.http.put(environment.apiURL+'/subcategories/'+subCategory.id+'/',subCategory).toPromise();
    else
      return this.http.post(environment.apiURL+'/subcategories/',subCategory).toPromise();
  }

  deletegetSubCategories(id){
    return this.http.delete(environment.apiURL+'/subcategories/'+id+'/').toPromise();
  }
}
