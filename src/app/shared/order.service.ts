import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http:HttpClient) { }

  getOrders(){
    return this.http.get(environment.apiURL+'/orders/').toPromise();
  }

  saveOrUpdatOrders(order:any){
    if(order.id>0)
      return this.http.put(environment.apiURL+'/orders/'+order.id+'/',order).toPromise();
    else
      return this.http.post(environment.apiURL+'/orders/',order).toPromise();
  }

  deleteOrders(id){
    return this.http.delete(environment.apiURL+'/orders/'+id+'/').toPromise();
  }

}
