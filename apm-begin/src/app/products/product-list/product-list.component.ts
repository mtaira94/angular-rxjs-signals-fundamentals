import { Component } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { EMPTY, Subscription, catchError, tap } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent {
  pageTitle = 'Products';
  errorMessage = '';
  // Selected product id to highlight the entry
  selectedProductId: number = 0;

  constructor(private productService: ProductService) { }

  // Products
  readonly products$ = this.productService.products$
    .pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );

  onSelected(productId: number): void {
    this.selectedProductId = productId;
  }
}
