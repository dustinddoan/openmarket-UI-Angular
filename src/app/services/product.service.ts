import { Product } from './../common/product';
import { Injectable, resolveForwardRef } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.apiDevUrl + '/products';

  private productCategoryUrl = environment.apiDevUrl + '/product-category';


  constructor(private httpClient: HttpClient) { }
  // return an observable map the JSON data from Spring Data REST API to Pdoruct Array
  getProductList(categoryId: number): Observable<Product[]> {

    // need to build URL base on categoryId
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  }

  getProductCategoryList() {
    return this.httpClient.get<GetResponseProductsCategory>(this.productCategoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  searchProducts(keyword: string) {
    const searchProductUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`

    // return this.httpClient.get<GetResponseProducts>(searchProductUrl).pipe(
    //   map(response => response._embedded.products)
    // )
    return this.httpClient.get<GetResponseProducts>(searchProductUrl).pipe(
      map(response => {
        return response._embedded.products})
    )

  }

  getProductDetail(id: number) {
    const productDetailsUrl = `${this.baseUrl}/${id}`
    return this.httpClient.get<Product>(productDetailsUrl).pipe(
      map(response => {
          console.log(response);
          return response;
      })
    )
  }



}

interface GetResponseProducts {
  _embedded: {
    products: Product[]
  }
}

interface GetResponseProductsCategory {
  _embedded: {
    productCategory: ProductCategory[]
  }
}
