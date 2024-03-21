import { Component, computed } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe]
})
export class ProductDetailComponent {
  //#region Signals
  product = this.productService.product;
  errorMessage = this.productService.productError;
  //#endregion
  //#region Computed
  // Set the page title
  pageTitle = computed(() => this.product()
  ? `Product Detail for: ${this.product()?.productName}`
  : 'Product Detail');
  //#endregion
  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  //#region Methods
  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
  //#endregion
}
