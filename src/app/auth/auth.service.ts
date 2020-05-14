import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../shared/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  constructor(private http:HttpClient,
    public jwtHelper: JwtHelperService,
    ) {  }

  loginUser(user){
    
    var dbModel = {"email":user.email,"password":user.password};
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post(environment.apiURL+'/token/',dbModel,{headers:headers});
  }

  public isAuthenticated(): boolean {    
    const token = localStorage.getItem('token');    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }

  registerUser(user){
    
    var dbModel = {"email":user.email,"password":user.password};
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post(environment.apiURL+'/register/',dbModel,{headers:headers}).toPromise();
  }

  check_email(email){
    var dbModel = {"email":email};
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post(environment.apiURL+'/check_email/',dbModel,{headers:headers}).toPromise();
  }

  menual_token(id){
    var dbModel = {"transactionId":id};
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.http.post(environment.apiURL+'/menual_token/',dbModel,{headers:headers});
  }

  user_info(id){
    return this.http.get(environment.apiURL+'/users/'+id);
  }

  configure_pass(user:any){
    return this.http.post(environment.apiURL+'/configure_pass/',user).toPromise();
  }
  
}
