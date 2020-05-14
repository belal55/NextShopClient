import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  getUers(){
    return this.http.get(environment.apiURL+'/users/').toPromise();
  }

  deleteUsers(id){
    return this.http.delete(environment.apiURL+'/users/'+id+'/').toPromise();
  }

  order_by_user(id){
    return this.http.get(environment.apiURL+'/order_by_user/'+id+'/').toPromise();
  }
}
