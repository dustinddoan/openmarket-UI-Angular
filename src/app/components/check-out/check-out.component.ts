import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'src/app/common/address';
import { CartItem } from 'src/app/common/cart-item';
import { Customer } from 'src/app/common/customer';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutServiceService } from 'src/app/services/checkout-service.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css'],
})
export class CheckOutComponent {
  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutServiceService,
    private router: Router
  ) {}

  checkoutFormGroup!: FormGroup;
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  totalQuantity: number = 0;
  userEmail: string = '';
  storage: Storage = sessionStorage;
  isDisabled: boolean = false;
  // stripe
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any;

  ngOnInit() {
    this.setupStripePaymentForm();

    this.reviewCartDetails();

    const userEmail = JSON.parse(this.storage.getItem('email')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: [userEmail, [Validators.required, Validators.email]],
      }),
      address: this.formBuilder.group({
        street: [''],
        city: [''],
        state: [''],
        zip: [''],
      }),
      paymentMethod: this.formBuilder.group({
        // cardType: ['', Validators.required],
        // name: [''],
        // cardNumber: [''],
        // expirationMonth: [''],
        // expirationYear: [''],
        // securityCode: [''],
      }),
      reviewOrder: this.formBuilder.group({
        totalQuantity: [0, [Validators.required, Validators.min(0)]],
        totalPrice: [0, [Validators.required, Validators.min(0)]],
      }),
    });


  }

  setupStripePaymentForm() {
    // get stripe handle elements
    var elements = this.stripe.elements();

    // create a card element ... and hide the zipcode field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // add an instance of card UI component into 'card-element
    this.cardElement.mount('#card-element');

    // event binding for change
    this.cardElement.on('change', (event: any) => {
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
  }

  handleCheckout() {
    console.log('checkout');

    console.log(this.checkoutFormGroup.value);
    this.isDisabled = true;
    // setup order
    let order = new Order();
    order.totalPrice = this.totalAmount;
    order.totalQuantity = this.totalQuantity;

    // create orderItems from CartItems
    const cartItems = this.cartService.cartItems;

    let orderItems: OrderItem[] = [];

    for (let item of cartItems) {
      orderItems.push(new OrderItem(item));
    }

    // populate purchase - customer
    let customer = new Customer();
    customer.firstName = this.checkoutFormGroup.value.customer.firstName;
    customer.lastName = this.checkoutFormGroup.value.customer.lastName;
    customer.email = this.checkoutFormGroup.value.customer.email;

    // populate purchase - address
    let shippingAddress = new Address();
    shippingAddress.street = this.checkoutFormGroup.value.address.street;
    shippingAddress.city = this.checkoutFormGroup.value.address.city;
    shippingAddress.state = this.checkoutFormGroup.value.address.state;
    shippingAddress.zipCode = this.checkoutFormGroup.value.address.zip;

    let billingAddress = new Address();
    billingAddress.street = this.checkoutFormGroup.value.address.street;
    billingAddress.city = this.checkoutFormGroup.value.address.city;
    billingAddress.state = this.checkoutFormGroup.value.address.state;
    billingAddress.zipCode = this.checkoutFormGroup.value.address.zip;

    // call API
    // customer: Customer;
    // shippingAddress: Address;
    // billingAddress: Address;
    // order: Order;
    // orderItems: OrderItem[];

    // setup purchase
    let purchase = new Purchase();
    purchase.customer = customer;
    purchase.shippingAddress = shippingAddress;
    purchase.billingAddress = billingAddress;
    purchase.order = order;
    purchase.orderItems = orderItems;


    //compute payment
    this.paymentInfo.amount = this.totalAmount * 100;
    this.paymentInfo.currency = 'USD';
    this.paymentInfo.receiptEmail = purchase.customer.email;

    console.log('payment info: ' + JSON.stringify(this.paymentInfo))

    // create payment-intent to SpringBoot API
    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {
    this.checkoutService
      .createPaymentIntent(this.paymentInfo)
      .subscribe((paymentIntentResponse) => {
        this.stripe
          .confirmCardPayment( // send to Stripe server
            paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
              },
            },
            { handleAction: false }
          )
          .then((result: any) => {
            if (result.error) {
              alert(`There was an error ${result.error.message}`);
              this.isDisabled = false;
            } else {
              this.checkoutService.placeOrder(purchase).subscribe({
                next: (response) => {
                  console.log(JSON.stringify(response));
                  alert(`Your order has been received.\n Order tracking number: ${response.orderTrackingNumber}`)
                  this.resetCart();
                  this.isDisabled = false;
                },
                error: (err: any) => {
                  console.log(err);
                  alert(`There was an error ${err.message}`)
                  this.isDisabled = false;
                },
              });
            }
          });
      });
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    // call API
  }


  resetCart() {
    this.storage.removeItem('cartItems');
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    this.checkoutFormGroup.reset();
    this.router.navigateByUrl('/products')
  }

  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });
    this.cartService.totalPrice.subscribe((data) => {
      this.totalAmount = data;
    });
  }
}
