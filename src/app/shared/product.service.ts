import { Injectable } from '@angular/core';
import {environment} from 'src/environments/environment'
import {HttpClient} from '@angular/common/http'
import {Product} from './product.Model'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http:HttpClient) { }

  getProducts(){
    return this.http.get(environment.apiURL+'/products/').toPromise();
  }

  saveOrUpdateProducts(formData:FormData){
    var id=formData.get('id');
    if(id!="0" && id!='null')
      return this.http.put(environment.apiURL+'/products/'+id+'/',formData).toPromise();
    else
      return this.http.post(environment.apiURL+'/products/',formData).toPromise();

  }

  deleteProducts(id){
    return this.http.delete(environment.apiURL+'/products/'+id+'/').toPromise();
  }

  deleteProductImage(id){
    return this.http.delete(environment.apiURL+'/productsImages/'+id+'/').toPromise();
  }

}
