import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Brand} from './brand.model'

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http:HttpClient) { }
  getBrands(){
    return this.http.get(environment.apiURL+'/brands/').toPromise();
  }

  saveOrUpdateBrands(brand:Brand){
    if(brand.id>0)
      return this.http.put(environment.apiURL+'/brands/'+brand.id+'/',brand).toPromise();
    else
      return this.http.post(environment.apiURL+'/brands/',brand).toPromise();
  }

  deleteBrands(id){
    return this.http.delete(environment.apiURL+'/brands/'+id+'/').toPromise();
  }
}
