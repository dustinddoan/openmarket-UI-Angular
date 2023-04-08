import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';
import { Product } from '../common/product';
@Injectable({
  providedIn: 'root',
})
export class CartService {
  // another approach:
  cartItems: CartItem[] = [];
  storage: Storage = sessionStorage;

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems')!);

    if (data !== null) {
      this.cartItems = data;
      this.computeCartTotal();
    }
  }

  addCartItemToCart(item: CartItem) {
    // console.log('addCartItemToCart')
    let alreadyInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === item.id) {
          existingCartItem = tempCartItem;
          break;
        }
      }
      alreadyInCart = existingCartItem !== undefined;
    }

    if (alreadyInCart && existingCartItem?.quantity !== undefined) {
      existingCartItem.quantity++;
    } else {
      this.cartItems.push(item);
    }

    let totalPrice = 0;
    let totalQuantity = 0;

    for (let tempCartItem of this.cartItems) {
      totalPrice += tempCartItem.unitPrice * tempCartItem.quantity;
      totalQuantity += tempCartItem.quantity;
    }

    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);

    this.persistCartItems();
  }

  itemsInCart(): CartItem[] {
    return this.cartItems;
  }

  resetCart() {
    console.log('resetCart')
    this.cartItems = [];
    this.totalPrice.next(0);
    this.totalQuantity.next(0);
  }

  persistCartItems() {
    console.log('persistCartItems');
    // console.log('persistCartItems' + JSON.stringify(this.cartItems));
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  computeCartTotal() {
    let totalPrice = 0;
    let totalQuantity = 0;
    for (let tempCartItem of this.cartItems) {
      totalPrice += tempCartItem.unitPrice * tempCartItem.quantity;
      totalQuantity += tempCartItem.quantity;
    }
    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);


  }
}
