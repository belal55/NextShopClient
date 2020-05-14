import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Category} from './category.model'

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http:HttpClient) { }

  getCategories(){
    return this.http.get(environment.apiURL+'/categories/').toPromise();
  }

  saveOrUpdateCategories(category:Category){
    if(category.id>0)
      return this.http.put(environment.apiURL+'/categories/'+category.id+'/',category).toPromise();
    else
      return this.http.post(environment.apiURL+'/categories/',category).toPromise();
  }

  deleteCategories(id){
    return this.http.delete(environment.apiURL+'/categories/'+id+'/').toPromise();
  }
}
