import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class OrderServiceService {
  storage: Storage = sessionStorage;
  private orderUrl =
    environment.apiDevUrl + '/orders/search/findByCustomerEmailOrderByDateCreatedDesc?email=';


  constructor(private httpClient: HttpClient) {

  }

  getOrdersHistory(email: string): Observable<GetResponseOrderHistory> {
    const token = JSON.parse(this.storage.getItem('token')!);
    const searchUrl = this.orderUrl + email;
    return this.httpClient.get<GetResponseOrderHistory>(searchUrl, {
      headers: { 'Authorization': 'Bearer ' + token}
    })
  }
}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[]
  }
}
