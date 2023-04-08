import { Component } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Output, EventEmitter } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent {
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}



  products: Product[] = [];
  currentCategory: number = 1;
  searchMode: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts()
    } else {
      this.handleListProducts();

    }
  }


  handleListProducts() {
    const hasCatergoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCatergoryId) {
      this.currentCategory = +this.route.snapshot.paramMap.get('id')!;
    } else {
      this.currentCategory = 1;
    }


    this.productService.getProductList(this.currentCategory).subscribe((data) => {
      this.products = data;
    });
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    this.productService.searchProducts(keyword).subscribe(data => {
      this.products = data;
    });
  }

  addProduct(product: Product) {
    const cartItem = new CartItem(product);
    this.cartService.addCartItemToCart(cartItem)
  }

}
