import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgIf, NgFor, NgClass } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent]
})
export class ProductListComponent implements OnInit, OnDestroy {
  pageTitle = 'Products';
  errorMessage = '';
  subProducts!: Subscription;
  subProduct!: Subscription;

  // Products
  products: Product[] = [];

  constructor(private productService: ProductService) { }

  // Selected product id to highlight the entry
  selectedProductId: number = 0;

  onSelected(productId: number): void {
    this.selectedProductId = productId;
  }

  ngOnInit(): void {
    this.subProducts = this.productService.getProducts()
      .pipe(
        tap(() => console.log(`In component pipeline getProducts`))
      )
      .subscribe(p => this.products = p);
  }

  ngOnDestroy(): void {
    this.subProducts.unsubscribe();
  }
}
