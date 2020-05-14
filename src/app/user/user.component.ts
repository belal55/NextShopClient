import { Component, OnInit,ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  users:User[];
  displayedColumns: string[] = ['id','email' ,'first_name', 'last_name','actions'];
  dataSource: MatTableDataSource<User>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private userService:UserService
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.userService.getUers().then(res=>{
        this.users=res as User[];
        this.dataSource = new MatTableDataSource<User>(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

    },err=>{
        alert(err)
    })
  }

  deleteUsers(id){
    this.userService.deleteUsers(id).then(res=>{
      this.getUsers();

    },err=>{
      alert(err)
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
