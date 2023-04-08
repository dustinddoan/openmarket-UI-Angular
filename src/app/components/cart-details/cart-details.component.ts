import { Component } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css'],
})
export class CartDetailsComponent {
  constructor(private cartService: CartService) {}

  cartItems: CartItem[] = [];
  subTotal: number = 0;

  totalQuantity: number = 0;
  totalAmount: number = 0;

  ngOnInit() {
    this.calculateTotal();
  }

  calculateTotal() {
    this.cartItems = this.cartService.itemsInCart();

    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });
    this.cartService.totalPrice.subscribe((data) => {
      this.totalAmount = data;
    });

    this.cartService.computeCartTotal();
  }

  removeFromCart(item: CartItem, index: number) {
    console.log(item, index);
    let updateCarts: CartItem[] = this.cartItems.slice(index, 1);
    this.calculateTotal();
  }
}
