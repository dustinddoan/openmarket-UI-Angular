import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Purchase } from '../common/purchase';
import { environment } from 'src/environments/environment.development';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root'
})
export class CheckoutServiceService {
  private purchaseUrl = environment.apiDevUrl + '/checkout/purchase';
  private paymentIntentUrl = environment.apiDevUrl + '/checkout/payment-intent';

  token: string = ''
  storage:Storage = sessionStorage;
  constructor(
    private httpClient: HttpClient
  ) {
    this.token = JSON.parse(sessionStorage.getItem('token')!);
   }

  placeOrder(purchase: Purchase): Observable<any> {
    // let token = JSON.parse(sessionStorage.getItem('token')!);
    return this.httpClient.post<Purchase>(this.purchaseUrl,purchase, {
      headers: { 'Authorization': 'Bearer ' + this.token}
    });
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl,paymentInfo, {
      headers: { 'Authorization': 'Bearer ' + this.token}
    })
  }
}
