export class Order {
	id:number;
	transactionId:number;
	sub_total:number;
	total_quantity:number;
	user:number;
	email:string;
	address:number;
	shippingAddress:string;
	status:number;
	date_created:string;
	orderitem_set:any[];
}
