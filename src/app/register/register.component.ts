import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  formData={
    email:'',
    password:'',
    confirmPassword:''
  }

  constructor(private authService:AuthService,private router:Router) { }

  ngOnInit(): void {
  }

  onSubmit(form:NgForm){
    if(form.valid){
      var us =form.value;
      this.authService.registerUser(us).then(res=>{
        this.authService.loginUser(us).subscribe((data:any) => {

          localStorage.setItem('token', data.access);
          localStorage.setItem('rtoken', data.refresh);
          if(data.groups[0]=="Admin")
            this.router.navigate(['/admin']);
          else{
            alert(data.groups[0]);
            this.router.navigate(['']);
          }
    
        },err=>{
          alert(err.error);
        });
      },err=>{
        alert(err.error);
      })

    }
    
  }

  

}
