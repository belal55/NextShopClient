import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  formData={
    email:'',
    password:'',
  }

  constructor(
    private authService:AuthService,
    private router:Router,
  ) { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm){
    var us =form.value;
    this.login(us);
  }

  login(us){
    this.authService.loginUser(us).subscribe((data:any) => {
     
      localStorage.setItem('token', data.access);
      localStorage.setItem('rtoken', data.refresh);

      if(data.groups[0]=="Admin")
        this.router.navigate(['/admin']);
      else
        this.router.navigate(['/dashboard']);
    },err=>{
      alert(err.error.detail);
    });
  }



}
