import { Component } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderServiceService } from 'src/app/services/order-service.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {
  customerEmail: string = '';
  storage: Storage = sessionStorage;
  token: string = '';
  constructor(private orderService: OrderServiceService) {

    // if (this.customerEmail != null) {
    //   this.getOrdersHistory(this.customerEmail);
    // }

  }
  ordersHistory: OrderHistory[] = [];

  ngOnInit() {
    this.getOrdersHistory();
  }
  getOrdersHistory() {
    this.customerEmail = JSON.parse(this.storage.getItem('email')!);
    // console.log('customerEmail: ' + this.customerEmail);

    this.orderService.getOrdersHistory(this.customerEmail).subscribe(data => {
      this.ordersHistory = data._embedded.orders;
      // console.log('orderHistory: ' + JSON.stringify(this.ordersHistory));
    })
  }

}
