import { Component } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { EMPTY, catchError, tap } from 'rxjs';
import { ProductService } from '../product.service';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe]
})
export class ProductDetailComponent {
  //#region Variables
  errorMessage = '';
  // Set the page title
  // pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';
  pageTitle = 'Product Detail';
  //#endregion
  //#region  Observables
  // Product to display
  product$ = this.productService.product$
    .pipe(
      tap(() => console.log(`In component pipeline onSelected`)),
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );
  //#endregion
  //#region Constructor
  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }
  //#endregion
  //#region Methods
  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
  //#endregion
}
