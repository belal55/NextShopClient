import { Component, OnInit,ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { Order } from '../shared/order.model';
import { OrderService } from '../shared/order.service';

import {animate, state, style, transition, trigger} from '@angular/animations';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class OrderComponent implements OnInit {
  orders:Order[];
  displayedColumns: string[] = ['id','transactionId','total_quantity','sub_total', 'email','shippingAddress','status','actions'];
  dataSource: MatTableDataSource<Order>;
  expandedElement: any;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private orderService:OrderService,
  ) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(){
    this.orderService.getOrders().then(res=>{
        this.orders=res as Order[];
        this.dataSource = new MatTableDataSource<Order>(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    },err=>{
        alert(err)
    })
  }

  deleteOrders(id){
    this.orderService.deleteOrders(id).then(res=>{
      this.getOrders();
      alert("Success");

    },err=>{
        alert(err)
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

