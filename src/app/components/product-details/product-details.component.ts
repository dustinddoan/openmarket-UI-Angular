import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  constructor(private route: ActivatedRoute,
    private productService: ProductService) { }

  product!: Product;
  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.productDetails();
    })
  }
  productDetails() {
    let productId = + this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductDetail(productId).subscribe((data) => {

      this.product = data;
    })
  }

}
